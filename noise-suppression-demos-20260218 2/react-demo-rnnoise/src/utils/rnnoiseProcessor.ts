/**
 * RNNoise Audio Processor - In-Worklet WASM Processing
 * 
 * All RNNoise WASM processing happens inside the AudioWorklet thread.
 * Main thread only handles initialization and control.
 * 
 * Architecture (matches Jitsi's approach):
 * - Main thread loads WASM binary and sends it to the worklet
 * - Worklet instantiates WASM and processes audio synchronously in process()
 * - No round-trip messaging for audio data — zero latency overhead
 * 
 * IMPORTANT: This processes OUTBOUND audio only (agent's microphone)
 */

import { logDebug, logInfo, logError, logSuccess } from './logger';

const SAMPLE_RATE = 48000;

export class RNNoiseAudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private isEnabled: boolean = false;
  private noiseLevel: number = 0;
  private processedFrames: number = 0;
  private rawStream: MediaStream | null = null;
  private processedStream: MediaStream | null = null;
  private isInitialized: boolean = false;

  // Settings
  private settings = {
    inputGain: 1.0,
    vadCompensation: 2.0,
    outputGain: 1.0
  };

  async initialize(inputStream: MediaStream): Promise<MediaStream> {
    logInfo('RNNOISE', 'Initializing RNNoise processor (in-worklet WASM)');
    
    try {
      this.rawStream = inputStream;

      // Load the WASM binary for the 0.2 suppression model
      logDebug('RNNOISE', 'Loading RNNoise WASM binary (0.2 suppression model)...');
      const wasmBinary = await this.loadWasmBinary();
      logSuccess('RNNOISE', `WASM binary loaded: ${wasmBinary.byteLength} bytes`);

      // Create audio context
      this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
      logDebug('RNNOISE', `AudioContext state: ${this.audioContext.state}, sampleRate: ${SAMPLE_RATE}`);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Register the AudioWorklet
      await this.audioContext.audioWorklet.addModule('/rnnoise-worklet-processor.js');
      logSuccess('RNNOISE', 'AudioWorklet module registered');

      // Create source from input stream
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);

      // Create AudioWorkletNode
      this.workletNode = new AudioWorkletNode(this.audioContext, 'rnnoise-worklet-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1]
      });

      // Wait for WASM initialization in the worklet
      const initPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Worklet WASM init timeout')), 10000);
        
        this.workletNode!.port.onmessage = (event) => {
          const { type } = event.data;
          
          if (type === 'ready') {
            clearTimeout(timeout);
            const { smokeTest } = event.data;
            logSuccess('RNNOISE', `WASM initialized in worklet. Smoke test: VAD=${smokeTest.vad}, beforeRMS=${smokeTest.beforeRMS}, afterRMS=${smokeTest.afterRMS}, reduction=${smokeTest.reduction}%`);
            // Set up ongoing message handler
            this.setupMessageHandler();
            resolve();
          } else if (type === 'error') {
            clearTimeout(timeout);
            reject(new Error(event.data.message));
          }
        };
      });

      // Send WASM binary to worklet (transferred, not copied)
      this.workletNode.port.postMessage(
        { type: 'init', data: { wasmBinary } },
        [wasmBinary]
      );

      await initPromise;

      // Create destination
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      // Connect: source → worklet → destination
      this.sourceNode.connect(this.workletNode);
      this.workletNode.connect(this.destinationNode);
      logSuccess('RNNOISE', 'Audio graph: source → worklet(RNNoise WASM) → destination');

      this.processedStream = this.destinationNode.stream;
      this.isInitialized = true;

      // Verify streams are different
      const rawId = this.rawStream.id;
      const processedId = this.processedStream.id;
      const rawTrackId = this.rawStream.getAudioTracks()[0]?.id;
      const processedTrackId = this.processedStream.getAudioTracks()[0]?.id;
      
      logInfo('RNNOISE', 'Stream verification', {
        rawStreamId: rawId,
        processedStreamId: processedId,
        rawTrackId: rawTrackId,
        processedTrackId: processedTrackId,
        streamsAreDifferent: rawId !== processedId,
        tracksAreDifferent: rawTrackId !== processedTrackId
      });

      logSuccess('RNNOISE', 'RNNoise processor initialized (in-worklet processing)');
      return this.destinationNode.stream;
    } catch (error) {
      logError('RNNOISE', 'Failed to initialize RNNoise processor', error);
      return inputStream;
    }
  }

  /**
   * Load the RNNoise WASM binary (0.2 suppression model).
   * Fetches the pre-extracted binary from public/rnnoise-sync-wasm.bin
   */
  private async loadWasmBinary(): Promise<ArrayBuffer> {
    const response = await fetch('/rnnoise-sync-wasm.bin');
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM binary: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    logDebug('RNNOISE', `WASM binary fetched: ${buffer.byteLength} bytes`);
    return buffer;
  }

  private setupMessageHandler() {
    if (!this.workletNode) return;
    
    this.workletNode.port.onmessage = (event) => {
      const { type } = event.data;
      
      if (type === 'activity') {
        const rms = event.data.rms as number;
        this.processedFrames = event.data.frame;
        
        // Convert RMS to 0-100 scale
        const dbLevel = rms > 0 ? 20 * Math.log10(rms) : -100;
        const mapped = Math.max(0, Math.min(100, ((dbLevel + 60) / 60) * 100));
        this.noiseLevel = Math.round(this.noiseLevel * 0.7 + mapped * 0.3);
      } else if (type === 'input_level') {
        logDebug('RNNOISE', `📊 Input levels - Frame ${event.data.frame}: RMS=${event.data.inputRMS}, Peak=${event.data.inputPeak}`);
      } else if (type === 'diagnostics') {
        const vadStatus = event.data.vadStatus || 'UNKNOWN';
        const emoji = vadStatus === 'VOICE' ? '🎤' : vadStatus === 'MAYBE' ? '🤔' : '🔇';
        logInfo('RNNOISE', `${emoji} Frame ${event.data.frame}: input=${event.data.inputRMS}, output=${event.data.outputRMS}, VAD=${event.data.vad} (${vadStatus}), reduction=${event.data.reduction}%`);
      } else if (type === 'voice_detected') {
        const confidence = event.data.confidence || 'UNKNOWN';
        const emoji = confidence === 'HIGH' ? '🎤' : '🤔';
        logSuccess('RNNOISE', `${emoji} VOICE DETECTED (${confidence})! Frame ${event.data.frame}: VAD=${event.data.vad}, input=${event.data.inputRMS}`);
      } else if (type === 'vad') {
        logDebug('RNNOISE', `VAD: ${event.data.value.toFixed(3)} (frame ${event.data.frame})`);
      } else if (type === 'error') {
        logError('RNNOISE', `Worklet error: ${event.data.message}`);
      }
    };
  }

  enable() {
    this.isEnabled = true;
    this.processedFrames = 0;
    if (this.workletNode) {
      this.workletNode.port.postMessage({ 
        type: 'enable',
        settings: this.settings
      });
    }
    logSuccess('RNNOISE', 'RNNoise ENABLED - suppressing background noise on outbound audio');
  }

  disable() {
    this.isEnabled = false;
    if (this.workletNode) {
      this.workletNode.port.postMessage({ type: 'disable' });
    }
    logInfo('RNNOISE', 'RNNoise DISABLED - audio passing through without processing');
  }

  updateSettings(newSettings: Partial<typeof this.settings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.workletNode && this.isEnabled) {
      this.workletNode.port.postMessage({ 
        type: 'updateSettings',
        settings: this.settings
      });
      logInfo('RNNOISE', 'Updated settings', this.settings);
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  toggle(): boolean {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  getState(): boolean { return this.isEnabled; }
  getNoiseLevel(): number { return this.noiseLevel; }
  getProcessedFrames(): number { return this.processedFrames; }
  getRawStream(): MediaStream | null { return this.rawStream; }
  getProcessedStream(): MediaStream | null { return this.processedStream; }
  isReady(): boolean { return this.isInitialized; }

  async cleanup() {
    logInfo('RNNOISE', 'Cleaning up RNNoise processor');
    this.isEnabled = false;

    if (this.workletNode) {
      this.workletNode.port.postMessage({ type: 'disable' });
      this.workletNode.disconnect();
      this.workletNode.port.close();
      this.workletNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    this.destinationNode = null;

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.noiseLevel = 0;
    this.processedFrames = 0;
    this.rawStream = null;
    this.processedStream = null;
    this.isInitialized = false;

    logSuccess('RNNOISE', 'RNNoise processor cleaned up');
  }
}

// Singleton instance
let processorInstance: RNNoiseAudioProcessor | null = null;

export function getRNNoiseProcessor(): RNNoiseAudioProcessor {
  if (!processorInstance) {
    processorInstance = new RNNoiseAudioProcessor();
  }
  return processorInstance;
}

export async function cleanupRNNoiseProcessor() {
  if (processorInstance) {
    await processorInstance.cleanup();
    processorInstance = null;
  }
}

/**
 * Speex Audio Processor - Browser-based Noise Suppression
 * 
 * Uses Speex DSP library via WebAssembly for real-time noise suppression.
 * Open-source, no backend required, runs entirely in browser.
 */

import { SpeexWorkletNode, loadSpeex } from '@sapphi-red/web-noise-suppressor';
import speexWorkletPath from '@sapphi-red/web-noise-suppressor/speexWorklet.js?url';
import speexWasmPath from '@sapphi-red/web-noise-suppressor/speex.wasm?url';

const SAMPLE_RATE = 48000;

export class SpeexAudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private speexNode: SpeexWorkletNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isEnabled: boolean = false;
  private rawStream: MediaStream | null = null;
  private processedStream: MediaStream | null = null;
  private isInitialized: boolean = false;
  private audioLevel: number = 0;
  private processedFrames: number = 0;
  private dataArray: Uint8Array | null = null;

  async initialize(inputStream: MediaStream): Promise<MediaStream> {
    console.log('[Speex] Initializing Speex processor...');
    
    try {
      this.rawStream = inputStream;

      // Create audio context
      this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
      console.log(`[Speex] AudioContext created: ${this.audioContext.state}, sampleRate: ${SAMPLE_RATE}`);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Load Speex WASM
      console.log('[Speex] Loading Speex WASM binary...');
      const speexWasmBinary = await loadSpeex({ url: speexWasmPath });
      console.log('[Speex] WASM binary loaded successfully');

      // Register AudioWorklet
      await this.audioContext.audioWorklet.addModule(speexWorkletPath);
      console.log('[Speex] AudioWorklet module registered');

      // Create source from input stream
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);

      // Create Speex node with stereo support
      this.speexNode = new SpeexWorkletNode(this.audioContext, {
        wasmBinary: speexWasmBinary,
        maxChannels: 2  // Support stereo audio
      });
      console.log('[Speex] SpeexWorkletNode created with stereo support');

      // Create analyser for audio level monitoring
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
      this.dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      console.log('[Speex] AnalyserNode created for audio monitoring');

      // Create destination
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      // Connect: source → speex → analyser → destination
      this.sourceNode.connect(this.speexNode);
      this.speexNode.connect(this.analyserNode);
      this.analyserNode.connect(this.destinationNode);
      console.log('[Speex] Audio graph: source → speex → analyser → destination');

      this.processedStream = this.destinationNode.stream;
      this.isInitialized = true;

      // Verify streams are different
      const rawId = this.rawStream.id;
      const processedId = this.processedStream.id;
      const rawTrackId = this.rawStream.getAudioTracks()[0]?.id;
      const processedTrackId = this.processedStream.getAudioTracks()[0]?.id;
      
      console.log('[Speex] Stream verification:', {
        rawStreamId: rawId,
        processedStreamId: processedId,
        rawTrackId: rawTrackId,
        processedTrackId: processedTrackId,
        streamsAreDifferent: rawId !== processedId,
        tracksAreDifferent: rawTrackId !== processedTrackId
      });

      console.log('[Speex] ✅ Speex processor initialized successfully');
      return this.destinationNode.stream;
    } catch (error) {
      console.error('[Speex] ❌ Failed to initialize Speex processor:', error);
      return inputStream;
    }
  }

  enable() {
    this.isEnabled = true;
    this.processedFrames = 0;
    console.log('[Speex] ✅ Speex ENABLED - suppressing background noise');
  }

  disable() {
    this.isEnabled = false;
    this.audioLevel = 0;
    this.processedFrames = 0;
    console.log('[Speex] ⏸️ Speex DISABLED - audio passing through without processing');
  }

  toggle(): boolean {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  getState(): boolean { 
    return this.isEnabled; 
  }
  
  getRawStream(): MediaStream | null { 
    return this.rawStream; 
  }
  
  getProcessedStream(): MediaStream | null { 
    return this.processedStream; 
  }
  
  isReady(): boolean { 
    return this.isInitialized; 
  }

  getAudioLevel(): number {
    if (!this.analyserNode || !this.dataArray || !this.isEnabled) {
      return 0;
    }

    this.analyserNode.getByteFrequencyData(this.dataArray);
    
    // Calculate average amplitude
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / this.dataArray.length;
    
    // Convert to percentage (0-100)
    this.audioLevel = Math.min(100, Math.round((average / 255) * 100));
    
    // Increment frame counter
    this.processedFrames++;
    
    return this.audioLevel;
  }

  getProcessedFrames(): number {
    return this.processedFrames;
  }

  async cleanup() {
    console.log('[Speex] Cleaning up Speex processor...');
    this.isEnabled = false;
    this.audioLevel = 0;
    this.processedFrames = 0;

    if (this.speexNode) {
      this.speexNode.disconnect();
      this.speexNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    this.destinationNode = null;
    this.dataArray = null;

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.rawStream = null;
    this.processedStream = null;
    this.isInitialized = false;

    console.log('[Speex] ✅ Speex processor cleaned up');
  }
}

// Singleton instance
let processorInstance: SpeexAudioProcessor | null = null;

export function getSpeexProcessor(): SpeexAudioProcessor {
  if (!processorInstance) {
    processorInstance = new SpeexAudioProcessor();
  }
  return processorInstance;
}

export async function cleanupSpeexProcessor() {
  if (processorInstance) {
    await processorInstance.cleanup();
    processorInstance = null;
  }
}

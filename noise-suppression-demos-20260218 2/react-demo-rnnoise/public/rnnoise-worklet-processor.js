/**
 * RNNoise AudioWorklet Processor - In-Worklet WASM Processing
 * 
 * Processes audio entirely within the AudioWorklet thread using RNNoise WASM.
 * No round-trip messaging to main thread — all denoising happens here.
 * 
 * Architecture (matches Jitsi's approach):
 * - Main thread sends WASM binary via postMessage
 * - Worklet instantiates WASM synchronously
 * - Circular buffer accumulates 128-sample blocks until 480 are ready
 * - RNNoise processes 480-sample frames in-place
 * - Denoised samples are output from the circular buffer
 * 
 * RNNoise expects float samples in int16 range (-32768 to 32767).
 * Audio worklet samples are in float range (-1 to 1).
 */
class RNNoiseWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._enabled = false;
    this._ready = false;
    this._frameCount = 0;
    
    // WASM state
    this._module = null;
    this._exports = null;
    this._memory = null;
    this._rnnoiseState = 0;
    this._pcmPtr = 0; // Persistent WASM memory for a single frame
    
    // Buffer sizes
    this._FRAME_SIZE = 480;
    
    // Input accumulator: collects 128-sample blocks until we have 480
    this._inputBuf = new Float32Array(1024);
    this._inputLen = 0;
    
    // Output accumulator: holds denoised 480-sample frames, drained 128 at a time
    this._outputBuf = new Float32Array(2048);
    this._outputLen = 0;
    
    // We need to accumulate 2 RNNoise frames (960 samples) before starting output
    // to ensure we always have enough denoised data. This adds ~20ms latency.
    this._primed = false;
    this._PRIME_THRESHOLD = 480 * 2; // 960 samples = 2 frames
    
    // Settings (can be updated via messages)
    this._settings = {
      inputGain: 1.0,
      vadCompensation: 2.0,
      outputGain: 1.0
    };
    
    this.port.onmessage = (event) => {
      const { type, data, settings } = event.data;
      
      if (type === 'enable') {
        this._enabled = true;
        // Reset buffer state
        this._inputLen = 0;
        this._outputLen = 0;
        this._primed = false;
        this._inputBuf.fill(0);
        this._outputBuf.fill(0);
        // Update settings if provided
        if (settings) {
          this._settings = { ...this._settings, ...settings };
        }
      } else if (type === 'disable') {
        this._enabled = false;
      } else if (type === 'updateSettings') {
        if (settings) {
          this._settings = { ...this._settings, ...settings };
          this.port.postMessage({ 
            type: 'settingsUpdated', 
            settings: this._settings 
          });
        }
      } else if (type === 'init') {
        // Receive WASM binary and initialize
        this._initWasm(data.wasmBinary);
      }
    };
  }

  _initWasm(wasmBinary) {
    try {
      // Mutable heap views — updated after instantiation and after memory growth
      // These are captured by closure in the import functions
      let HEAPU8 = null;
      
      const self = this;
      
      // Minimal emscripten imports needed by rnnoise WASM
      // The WASM module only imports 2 functions: a.a and a.b
      // It exports its own memory as 'c' (no memory import needed)
      const imports = {
        a: {
          // a.a = _emscripten_resize_heap
          a: function(requestedSize) {
            const oldSize = HEAPU8.length;
            requestedSize = requestedSize >>> 0;
            const maxHeapSize = 2147483648;
            if (requestedSize > maxHeapSize) return false;
            
            const alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
            for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
              let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
              overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
              const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
              try {
                self._memory.grow((newSize - self._memory.buffer.byteLength + 65535) >>> 16);
                // Update heap views after grow
                HEAPU8 = new Uint8Array(self._memory.buffer);
                return true;
              } catch (e) { /* try next cutDown */ }
            }
            return false;
          },
          // a.b = _emscripten_memcpy_big
          b: function(dest, src, num) {
            HEAPU8.copyWithin(dest, src, src + num);
          }
        }
      };
      
      // Compile and instantiate WASM synchronously
      const wasmModule = new WebAssembly.Module(wasmBinary);
      const instance = new WebAssembly.Instance(wasmModule, imports);
      
      this._exports = instance.exports;
      
      // The WASM module exports its own memory as 'c'
      this._memory = this._exports.c;
      HEAPU8 = new Uint8Array(this._memory.buffer);
      
      // Call __wasm_call_ctors (export 'd') to initialize
      this._exports.d();
      
      // Initialize RNNoise: _rnnoise_init(0) = export 'g'
      this._exports.g(0);
      
      // Create RNNoise state: _rnnoise_create(0) = export 'h'
      this._rnnoiseState = this._exports.h(0);
      
      if (!this._rnnoiseState) {
        this.port.postMessage({ type: 'error', message: 'Failed to create RNNoise state' });
        return;
      }
      
      // Allocate persistent memory for one frame (480 * 4 bytes)
      // _malloc = export 'e'
      this._pcmPtr = this._exports.e(this._FRAME_SIZE * 4);
      
      if (!this._pcmPtr) {
        this.port.postMessage({ type: 'error', message: 'Failed to allocate WASM memory for frame' });
        return;
      }
      
      // Run smoke test
      const testHeap = new Float32Array(this._memory.buffer);
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        testHeap[this._pcmPtr / 4 + i] = (Math.random() * 2 - 1) * 5000;
      }
      let beforeRMS = 0;
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        const v = testHeap[this._pcmPtr / 4 + i];
        beforeRMS += v * v;
      }
      beforeRMS = Math.sqrt(beforeRMS / this._FRAME_SIZE);
      
      // _rnnoise_process_frame = export 'j'
      const testVad = this._exports.j(this._rnnoiseState, this._pcmPtr, this._pcmPtr);
      
      const afterHeap = new Float32Array(this._memory.buffer);
      let afterRMS = 0;
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        const v = afterHeap[this._pcmPtr / 4 + i];
        afterRMS += v * v;
      }
      afterRMS = Math.sqrt(afterRMS / this._FRAME_SIZE);
      
      const reduction = ((1 - afterRMS / beforeRMS) * 100).toFixed(1);
      
      // Recreate state for clean processing
      this._exports.i(this._rnnoiseState); // _rnnoise_destroy
      this._exports.g(0); // _rnnoise_init
      this._rnnoiseState = this._exports.h(0); // _rnnoise_create
      
      this._ready = true;
      this.port.postMessage({ 
        type: 'ready',
        smokeTest: {
          vad: testVad,
          beforeRMS: beforeRMS.toFixed(1),
          afterRMS: afterRMS.toFixed(1),
          reduction: reduction
        }
      });
    } catch (err) {
      this.port.postMessage({ type: 'error', message: err.message || String(err) });
    }
  }

  /**
   * Process audio. Called by the browser at a fixed rate with 128 samples.
   * 
   * Strategy (linear buffer with in-place processing):
   * - Accumulate input samples in a buffer
   * - When we have >= 480 samples, process through RNNoise in-place
   * - Output the oldest 128 processed samples
   * - Latency: ~10ms (one 480-sample frame at 48kHz)
   */
  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input[0] || !output || !output[0]) {
      return true;
    }
    
    const inputChannel = input[0];
    const outputChannel = output[0];
    const blockSize = outputChannel.length; // 128
    
    this._frameCount++;
    
    if (!this._enabled || !this._ready) {
      // Pass through when disabled or not ready
      outputChannel.set(inputChannel);
      return true;
    }
    
    // Append incoming samples to input accumulator
    // RNNoise expects float32 samples in int16 range (-32768 to 32767)
    // Web Audio API provides samples in float range (-1 to 1)
    
    // Calculate input RMS to understand audio levels
    let inputRMS = 0;
    for (let i = 0; i < blockSize; i++) {
      inputRMS += inputChannel[i] * inputChannel[i];
    }
    inputRMS = Math.sqrt(inputRMS / blockSize);
    
    // Log input levels periodically to diagnose quiet audio
    if (this._frameCount % 100 === 0) {
      this.port.postMessage({
        type: 'input_level',
        frame: this._frameCount,
        inputRMS: inputRMS.toFixed(6),
        inputPeak: Math.max(...Array.from(inputChannel).map(Math.abs)).toFixed(6)
      });
    }
    
    for (let i = 0; i < blockSize; i++) {
      const sample = inputChannel[i];
      
      // Apply input gain from settings
      const gainedSample = sample * this._settings.inputGain;
      
      // Scale from [-1, 1] to approximately [-32768, 32767] range
      // But keep as float32 values (RNNoise expects float32, not int16)
      const scaled = gainedSample * 32768.0;
      
      this._inputBuf[this._inputLen + i] = scaled;
    }
    this._inputLen += blockSize;
    
    // Process complete 480-sample frames through RNNoise
    while (this._inputLen >= this._FRAME_SIZE) {
      const heapF32 = new Float32Array(this._memory.buffer);
      
      // Calculate input RMS for diagnostics
      let inputRMS = 0;
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        inputRMS += this._inputBuf[i] * this._inputBuf[i];
      }
      inputRMS = Math.sqrt(inputRMS / this._FRAME_SIZE);
      
      // Copy 480 samples to WASM memory
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        heapF32[this._pcmPtr / 4 + i] = this._inputBuf[i];
      }
      
      // Process in-place: _rnnoise_process_frame(state, out, in) = export 'j'
      const vad = this._exports.j(this._rnnoiseState, this._pcmPtr, this._pcmPtr);
      
      // Apply VAD compensation from settings
      // When VAD is low, RNNoise over-suppresses, so we boost the output
      const vadCompensation = vad < 0.1 ? this._settings.vadCompensation : 1.0;
      
      // Calculate output RMS for diagnostics
      let outputRMS = 0;
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        const v = heapF32[this._pcmPtr / 4 + i];
        outputRMS += v * v;
      }
      outputRMS = Math.sqrt(outputRMS / this._FRAME_SIZE);
      
      // Log diagnostics every 100 frames (~1 second)
      if (this._frameCount % 100 === 0) {
        this.port.postMessage({
          type: 'diagnostics',
          frame: this._frameCount,
          inputRMS: inputRMS.toFixed(1),
          outputRMS: outputRMS.toFixed(1),
          vad: vad.toFixed(3),
          inputGain: this._settings.inputGain.toFixed(1),
          vadCompensation: vadCompensation.toFixed(1),
          outputGain: this._settings.outputGain.toFixed(1),
          reduction: ((1 - outputRMS / inputRMS) * 100).toFixed(1),
          vadStatus: vad > 0.5 ? 'VOICE' : vad > 0.2 ? 'MAYBE' : 'NOISE (COMPENSATED)'
        });
      }
      
      // Log when VAD detects voice (lowered threshold to 0.2 to catch weak voice)
      if (vad > 0.2) {
        this.port.postMessage({
          type: 'voice_detected',
          frame: this._frameCount,
          vad: vad.toFixed(3),
          inputRMS: inputRMS.toFixed(1),
          confidence: vad > 0.5 ? 'HIGH' : 'LOW'
        });
      }
      
      // Read denoised samples into output accumulator
      // Apply VAD compensation and output gain
      const totalGain = vadCompensation * this._settings.outputGain;
      for (let i = 0; i < this._FRAME_SIZE; i++) {
        this._outputBuf[this._outputLen + i] = heapF32[this._pcmPtr / 4 + i] * totalGain;
      }
      this._outputLen += this._FRAME_SIZE;
      
      // Shift remaining input samples to front
      const remaining = this._inputLen - this._FRAME_SIZE;
      if (remaining > 0) {
        this._inputBuf.copyWithin(0, this._FRAME_SIZE, this._inputLen);
      }
      this._inputLen = remaining;
    }
    
    // Output 128 denoised samples if available
    // Wait until we've accumulated enough output (priming) to avoid gaps
    if (!this._primed) {
      if (this._outputLen >= this._PRIME_THRESHOLD) {
        this._primed = true;
      } else {
        outputChannel.fill(0);
        // Report activity even during priming
        if (this._frameCount % 50 === 0) {
          let sumSq = 0;
          for (let i = 0; i < blockSize; i++) {
            sumSq += inputChannel[i] * inputChannel[i];
          }
          const rms = Math.sqrt(sumSq / blockSize);
          this.port.postMessage({ type: 'activity', rms: rms, frame: this._frameCount });
        }
        return true;
      }
    }
    
    if (this._outputLen >= blockSize) {
      for (let i = 0; i < blockSize; i++) {
        // Scale back from int16 range to float range
        // Divide by 32768 to match input scaling (no gain compensation needed)
        outputChannel[i] = this._outputBuf[i] / 32768.0;
      }
      
      // Shift remaining output samples to front
      const remaining = this._outputLen - blockSize;
      if (remaining > 0) {
        this._outputBuf.copyWithin(0, blockSize, this._outputLen);
      }
      this._outputLen = remaining;
    } else {
      // Not enough denoised data yet (startup latency) — output silence
      outputChannel.fill(0);
    }
    
    // Report activity level periodically
    if (this._frameCount % 50 === 0) {
      let sumSq = 0;
      for (let i = 0; i < blockSize; i++) {
        sumSq += inputChannel[i] * inputChannel[i];
      }
      const rms = Math.sqrt(sumSq / blockSize);
      this.port.postMessage({ type: 'activity', rms: rms, frame: this._frameCount });
    }
    
    return true;
  }
}

registerProcessor('rnnoise-worklet-processor', RNNoiseWorkletProcessor);

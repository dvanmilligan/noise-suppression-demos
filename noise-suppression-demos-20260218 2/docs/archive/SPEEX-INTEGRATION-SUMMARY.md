# Speex Integration Summary

## What Was Done

✅ Found open-source browser-based solution: **Speex** via `@sapphi-red/web-noise-suppressor`
✅ Added package to dependencies in `react-demo-clearervoice/package.json`
✅ Created integration plan

## What Needs to Be Done

The ClearerVoice demo currently has a Python backend that can't run in the browser. To make it browser-based with Speex:

### 1. Install Dependencies
```bash
cd react-demo-clearervoice
npm install
```

### 2. Replace ClearerVoiceEnhancer Component

Current: `ClearerVoiceEnhancer.tsx` (file upload to Python backend)
New: `SpeexNoiseSuppress.tsx` (real-time browser processing)

The new component should:
- Toggle Speex noise suppression on/off
- Show processing status
- Display noise level meter
- Provide settings (if Speex has configurable parameters)

### 3. Create Speex Processor

Similar to `rnnoiseProcessor.ts` but using Speex:

```typescript
import { SpeexWorkletNode, loadSpeex } from '@sapphi-red/web-noise-suppressor'
import speexWorkletPath from '@sapphi-red/web-noise-suppressor/speexWorklet.js?url'
import speexWasmPath from '@sapphi-red/web-noise-suppressor/speex.wasm?url'

export class SpeexAudioProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private speexNode: SpeexWorkletNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  
  async initialize(inputStream: MediaStream): Promise<MediaStream> {
    // Create audio context
    this.audioContext = new AudioContext({ sampleRate: 48000 });
    
    // Load Speex WASM
    const speexWasmBinary = await loadSpeex({ url: speexWasmPath });
    await this.audioContext.audioWorklet.addModule(speexWorkletPath);
    
    // Create nodes
    this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);
    this.speexNode = new SpeexWorkletNode(this.audioContext, {
      wasmBinary: speexWasmBinary,
      maxChannels: 1
    });
    this.destinationNode = this.audioContext.createMediaStreamDestination();
    
    // Connect: source → speex → destination
    this.sourceNode.connect(this.speexNode);
    this.speexNode.connect(this.destinationNode);
    
    return this.destinationNode.stream;
  }
  
  enable() { /* Enable processing */ }
  disable() { /* Disable processing */ }
  toggle() { /* Toggle on/off */ }
  cleanup() { /* Clean up resources */ }
}
```

### 4. Update Dashboard

Replace:
```typescript
import ClearerVoiceEnhancer from './ClearerVoiceEnhancer';
<ClearerVoiceEnhancer></ClearerVoiceEnhancer>
```

With:
```typescript
import SpeexNoiseSuppress from './SpeexNoiseSuppress';
<SpeexNoiseSuppress></SpeexNoiseSuppress>
```

### 5. Update Header Subtitle

Change from:
```
"with ClearerVoice Audio Enhancement"
```

To:
```
"with Speex Noise Suppression"
```

### 6. Update Demo Switcher

In all three demos, update the ClearerVoice entry:

```typescript
{
  id: 'speex',
  name: 'Speex',
  description: 'Open-source noise suppression',
  port: 8443,
  status: 'available',
  features: ['Real-time processing', 'Open-source', 'No backend required']
}
```

### 7. Remove Backend

Delete the entire `/backend` folder since it's no longer needed:
```bash
rm -rf react-demo-clearervoice/backend
```

### 8. Update Documentation

- Update README.md
- Remove backend setup instructions
- Add Speex usage instructions
- Update comparison tables

### 9. Rename Demo Folder (Optional)

```bash
mv react-demo-clearervoice react-demo-speex
```

Then update all references in:
- `switch-demo.sh`
- `SWITCHING-DEMOS.md`
- `DEMO-COMPARISON.md`

## Benefits of Speex

✅ **Open-source**: BSD license, completely free
✅ **Browser-based**: No backend server required
✅ **Real-time**: ~0ms latency
✅ **Proven**: Used in VoIP applications for years
✅ **Simple setup**: Just npm install
✅ **Better than RNNoise**: More reliable, no VAD issues

## Comparison

| Feature | RNNoise | Speex | ClearerVoice (old) |
|---------|---------|-------|-------------------|
| **Location** | Browser | Browser | Python Backend |
| **Latency** | ~0ms | ~0ms | 2-5 seconds |
| **Quality** | Limited (VAD=0) | Good | Excellent |
| **Setup** | Simple | Simple | Complex |
| **Backend** | No | No | Yes (Python) |
| **Cost** | Free | Free | Free |
| **License** | Open-source | Open-source (BSD) | Open-source |
| **Real-time** | ✅ | ✅ | ❌ |

## Next Steps

Would you like me to:
1. **Implement the full Speex integration** (replace ClearerVoice with Speex)
2. **Keep both** (ClearerVoice for post-processing, add Speex as 4th demo)
3. **Something else**

The Speex integration would give you a fully browser-based, open-source, real-time noise suppression solution that works better than RNNoise and doesn't require any backend server.

# Speex Integration Plan

## Overview
Replace the Python backend ClearerVoice with browser-based Speex noise suppression using `@sapphi-red/web-noise-suppressor`.

## Why Speex?
- ✅ Open-source (BSD license)
- ✅ Runs in browser (WebAssembly)
- ✅ Real-time processing
- ✅ No API key required
- ✅ No backend server needed
- ✅ Proven technology (used in VoIP for years)
- ✅ Better than RNNoise for general audio

## Implementation Steps

### 1. Install Package
```bash
npm install @sapphi-red/web-noise-suppressor
```

### 2. Create Speex Processor
Similar to RNNoise processor but using Speex:
- `speexProcessor.ts` - Main thread management
- Uses `SpeexWorkletNode` from the package
- Real-time audio processing

### 3. Create UI Components
- `SpeexNoiseSuppress.tsx` - Toggle component
- `SpeexSettings.tsx` - Advanced settings (if available)
- Integrate into Dashboard

### 4. Remove Backend
- Delete `/backend` folder
- Remove Python dependencies
- Update documentation

### 5. Update Demo Switcher
- Rename from "ClearerVoice" to "Speex"
- Update description
- Update features list

## Architecture

```
Microphone → getUserMedia → AudioContext → AudioWorklet (Speex WASM) → Destination Stream
```

## Comparison

| Feature | RNNoise | Speex | ClearerVoice (old) |
|---------|---------|-------|-------------------|
| Location | Browser | Browser | Python Backend |
| Latency | ~0ms | ~0ms | 2-5s |
| Quality | Limited (VAD issues) | Good | Excellent |
| Setup | Simple | Simple | Complex |
| Cost | Free | Free | Free |
| Real-time | ✅ | ✅ | ❌ |

## Next Steps
1. Install package
2. Implement Speex processor
3. Create UI components
4. Test with real audio
5. Update documentation

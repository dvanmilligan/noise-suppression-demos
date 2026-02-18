# WebRTC Demo Apps - Voice Isolation Comparison

## Overview

This repository contains multiple demo applications to compare different voice isolation and noise suppression technologies with the Genesys Cloud WebRTC SDK.

## Demo Applications

### 1. Baseline Demo (Original)
**Port**: https://localhost:8443/  
**Location**: `react-demo-app/`  
**Status**: ✅ Running

**Features**:
- Standard WebRTC softphone
- No additional voice isolation
- Baseline for comparison

---

### 2. RNNoise Demo
**Port**: https://localhost:8444/  
**Location**: `react-demo-rnnoise/`  
**Status**: ✅ Running

**Technology**: RNNoise (Xiph.Org Foundation via Jitsi WASM)  
**License**: BSD-3-Clause (Commercial use allowed)

**Features**:
- Real-time noise suppression using recurrent neural networks
- Toggle on/off during calls
- Low latency (<10ms)
- Small footprint (~100KB)
- Battle-tested in Jitsi Meet

**Best For**:
- Quick implementation
- General background noise reduction
- Low computational overhead

---

### 3. DeepFilterNet3 Demo
**Port**: https://localhost:8445/  
**Location**: `react-demo-deepfilternet/`  
**Status**: 🚧 In Progress

**Technology**: DeepFilterNet3  
**License**: MIT or Apache 2.0 (Dual licensed - Commercial use allowed)

**Features**:
- State-of-the-art noise suppression
- Full-band audio support (48kHz)
- Superior quality vs RNNoise
- Real-time capable on CPU

**Best For**:
- Maximum noise suppression quality
- Professional audio quality requirements
- When computational resources are available

---

### 4. ClearerVoice Studio Demo
**Port**: https://localhost:8446/  
**Location**: `react-demo-clearervoice/`  
**Status**: 🚧 Planned

**Technology**: ClearerVoice-Studio (ModelScope)  
**License**: Apache 2.0 (Commercial use allowed)

**Features**:
- Target speaker extraction
- True voice isolation (removes background voices)
- Speech separation capabilities
- Highest quality but requires server-side processing

**Best For**:
- Maximum voice isolation
- Removing background agent voices
- When server infrastructure is available

---

## Quick Start

### Start All Demos

```bash
# Terminal 1 - Baseline
cd react-demo-app
npm run dev

# Terminal 2 - RNNoise
cd react-demo-rnnoise
npm run dev

# Terminal 3 - DeepFilterNet3 (when ready)
cd react-demo-deepfilternet
npm run dev

# Terminal 4 - ClearerVoice (when ready)
cd react-demo-clearervoice
npm run dev
```

### Build SDK First

If you've made changes to the SDK:

```bash
# From repository root
npm run build

# Then start any demo app
cd react-demo-rnnoise
npm install
npm run dev
```

---

## Comparison Matrix

| Feature | Baseline | RNNoise | DeepFilterNet3 | ClearerVoice |
|---------|----------|---------|----------------|--------------|
| **Noise Suppression** | ❌ None | ✅ Good | ✅ Excellent | ✅ Excellent |
| **Voice Isolation** | ❌ None | ⚠️ Limited | ⚠️ Limited | ✅ Excellent |
| **Latency** | N/A | <10ms | ~20ms | ~100ms+ |
| **CPU Usage** | Low | Low | Medium | High (server) |
| **Implementation** | N/A | Easy | Medium | Complex |
| **Commercial Use** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **License** | MIT | BSD-3 | MIT/Apache-2.0 | Apache-2.0 |

---

## Testing Recommendations

### Test Scenarios

1. **Background Noise**
   - Keyboard typing
   - Fan noise
   - Street sounds
   - Test all demos and compare

2. **Background Voices** (Primary Goal)
   - Other agents talking nearby
   - Office conversations
   - Multiple speakers
   - Focus on ClearerVoice for best results

3. **Audio Quality**
   - Voice clarity
   - Natural sound
   - Artifacts or distortion
   - Compare processed vs original

### Evaluation Criteria

- **Effectiveness**: How well does it remove unwanted sounds?
- **Quality**: Does the agent's voice sound natural?
- **Latency**: Is there noticeable delay?
- **Reliability**: Does it work consistently?
- **Usability**: Is it easy to enable/disable?

---

## Architecture Notes

### RNNoise Integration
- Uses ScriptProcessorNode for audio processing
- Processes 480 samples (10ms) at a time
- Can be toggled on/off during calls
- Minimal impact on existing SDK code

### DeepFilterNet3 Integration (Planned)
- Requires WASM compilation from Rust
- AudioWorklet for better performance
- Larger model size but better quality

### ClearerVoice Integration (Planned)
- Server-side Python service
- WebSocket streaming for audio
- Highest latency but best voice isolation
- Requires additional infrastructure

---

## Next Steps

1. ✅ Complete RNNoise demo
2. ⏳ Implement DeepFilterNet3 demo
3. ⏳ Implement ClearerVoice demo
4. ⏳ Add side-by-side comparison UI
5. ⏳ Performance benchmarking
6. ⏳ User testing and feedback

---

## Resources

- [RNNoise Paper](https://jmvalin.ca/demo/rnnoise/)
- [DeepFilterNet3 Paper](https://arxiv.org/abs/2305.08227)
- [ClearerVoice-Studio](https://github.com/modelscope/ClearerVoice-Studio)
- [Voice Isolation Research](./voice-isolation-research.md)

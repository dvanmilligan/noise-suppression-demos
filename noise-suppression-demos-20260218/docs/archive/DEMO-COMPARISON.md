# Demo Comparison Guide

This document compares the three available demo applications for the Genesys Cloud WebRTC SDK.

## Quick Comparison Table

| Feature | Baseline | RNNoise | Speex |
|---------|----------|---------|-------|
| **Noise Suppression** | Browser only | Real-time WASM | Real-time WASM |
| **Processing Location** | Browser | Browser | Browser |
| **Latency** | 0ms | ~0ms | ~0ms |
| **Quality** | Basic | Limited (VAD issues) | Good |
| **Setup Complexity** | Simple | Simple | Simple |
| **Backend Required** | No | No | No |
| **Real-time** | ✅ | ✅ | ✅ |
| **License** | N/A | Open-source | Open-source (BSD) |
| **Use Case** | Testing | Experimental | Live calls |

## Demo 1: Baseline

### Overview
The standard Genesys Cloud WebRTC SDK demo with no additional noise suppression beyond what the browser provides.

### Features
- ✅ Basic WebRTC functionality
- ✅ Call controls (mute, hold, transfer)
- ✅ Device selection
- ✅ Browser's built-in noise suppression (optional)

### When to Use
- Testing basic SDK functionality
- Comparing against enhanced versions
- Environments with minimal background noise
- When simplicity is priority

### Pros
- Simplest setup
- No additional dependencies
- Lowest latency
- Most reliable

### Cons
- Limited noise suppression
- No advanced audio processing
- Relies on browser capabilities

## Demo 2: RNNoise

### Overview
Integrates RNNoise WASM for real-time noise suppression in the browser.

### Features
- ✅ Real-time noise suppression
- ✅ AudioWorklet processing
- ✅ Toggle on/off during calls
- ✅ Adjustable parameters (input gain, VAD compensation, output gain)
- ✅ Call recorder with comparison
- ✅ Advanced mic settings
- ✅ Diagnostic logging

### When to Use
- Live call scenarios
- Low-latency requirements
- Browser-only environments
- Testing real-time noise suppression

### Pros
- Zero latency overhead
- Runs entirely in browser
- No backend required
- Real-time processing

### Cons
- VAD issues (returns 0.000 for some audio)
- Limited effectiveness
- Can distort audio
- Not as sophisticated as AI models

### Known Issues
- Voice Activity Detection doesn't work reliably
- Over-suppresses when VAD=0
- Audio quality can be degraded
- **Recommendation**: Use browser's built-in NS instead

## Demo 3: ClearerVoice

### Overview
Integrates ClearerVoice-Studio AI models via Python backend for state-of-the-art audio enhancement.

### Features
- ✅ 3 AI models (MossFormer2, FRCRN, MossFormerGAN)
- ✅ File upload & processing
- ✅ Progress tracking
- ✅ Side-by-side audio comparison
- ✅ Download enhanced audio
- ✅ Quality metrics (PESQ, STOI)
- ✅ RESTful API
- ✅ WebSocket progress updates

### When to Use
- Post-call audio enhancement
- Podcast/recording cleanup
- Quality comparison testing
- Batch processing
- Archival audio improvement

### Pros
- Excellent quality (SOTA AI)
- Multiple model options
- Proven technology (3M+ uses)
- Measurable quality metrics
- Active development

### Cons
- Requires Python backend
- 2-5 second processing delay
- Not real-time
- ~500MB model download on first run
- ~2GB RAM during processing

### Models

#### MossFormer2_SE_48K
- **Sample Rate**: 48kHz
- **PESQ**: 3.16
- **STOI**: 0.95
- **Best For**: High-quality recordings

#### FRCRN_SE_16K
- **Sample Rate**: 16kHz
- **PESQ**: 3.23
- **STOI**: 0.95
- **Best For**: Fast processing

#### MossFormerGAN_SE_16K
- **Sample Rate**: 16kHz
- **PESQ**: 3.47
- **STOI**: 0.96
- **Best For**: Best 16kHz quality

## Use Case Recommendations

### Live Call Scenarios
**Recommended**: Baseline with browser NS

The browser's built-in noise suppression is the most reliable for live calls. While RNNoise offers more sophisticated processing, its VAD issues make it unreliable.

### Post-Call Enhancement
**Recommended**: ClearerVoice

For enhancing recorded calls or audio files, ClearerVoice provides the best quality. The 2-5 second processing delay is acceptable for post-processing.

### Testing & Development
**Recommended**: Baseline

Start with the baseline to understand core SDK functionality, then compare against enhanced versions.

### Quality Comparison
**Recommended**: All three

Use the demo switcher to compare all three approaches:
1. Record with Baseline
2. Record with RNNoise
3. Enhance with ClearerVoice
4. Compare results

## Setup Requirements

### Baseline
```bash
cd react-demo-app
npm install
npm run dev
```

### RNNoise
```bash
cd react-demo-rnnoise
npm install
npm run dev
```

### ClearerVoice
```bash
# Terminal 1: Backend
cd react-demo-clearervoice/backend
./start.sh

# Terminal 2: Frontend
cd react-demo-clearervoice
npm install
npm run dev
```

## Performance Comparison

### Processing Time
| Demo | Latency | Processing |
|------|---------|------------|
| Baseline | 0ms | Real-time |
| RNNoise | ~0ms | Real-time |
| ClearerVoice | 2-5s | Async |

### Memory Usage
| Demo | RAM Usage |
|------|-----------|
| Baseline | ~100MB |
| RNNoise | ~200MB |
| ClearerVoice | ~2GB (during processing) |

### Quality Scores (PESQ)
| Demo | Score | Notes |
|------|-------|-------|
| Baseline | ~2.0 | Depends on browser NS |
| RNNoise | ~2.5 | When working correctly |
| ClearerVoice | 3.16-3.47 | Varies by model |

## Switching Between Demos

Use the demo switcher script:

```bash
./switch-demo.sh
```

Or manually:
1. Stop current demo (Ctrl+C)
2. Start desired demo
3. Refresh browser (https://localhost:8443/)

## Visual Identification

Each demo displays a subtitle in the header:

- **Baseline**: "Genesys Cloud WebRTC SDK"
- **RNNoise**: "Genesys Cloud WebRTC SDK - with RNNoise Voice Isolation"
- **ClearerVoice**: "Genesys Cloud WebRTC SDK - with ClearerVoice Audio Enhancement"

## Troubleshooting

### All Demos
- Ensure only one demo is running at a time (port 8443)
- Hard refresh browser after switching (Cmd+Shift+R)
- Check OAuth configuration

### RNNoise Specific
- VAD consistently shows 0.000 → Use browser NS instead
- Audio sounds distorted → Adjust settings or disable
- Not reducing noise → Known limitation

### ClearerVoice Specific
- Backend not running → Start with `./backend/start.sh`
- Models downloading slowly → Wait 2-5 minutes on first run
- Processing fails → Check backend logs

## Conclusion

Each demo serves a different purpose:

- **Baseline**: Best for live calls and testing
- **RNNoise**: Experimental real-time processing (limited effectiveness)
- **ClearerVoice**: Best for post-call enhancement and quality

Choose based on your use case and requirements.

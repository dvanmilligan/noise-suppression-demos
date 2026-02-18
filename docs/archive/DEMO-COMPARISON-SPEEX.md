# Demo Comparison - Updated for Speex

## Three Demos Available

### 1. Baseline
- Standard WebRTC with browser NS
- Simple, reliable, low latency
- No additional processing

### 2. RNNoise  
- Real-time browser noise suppression
- Experimental, has VAD issues
- Open-source

### 3. Speex ⭐ NEW
- Open-source noise suppression
- Real-time, browser-based
- Better than RNNoise
- No backend required

## Quick Comparison

| Feature | Baseline | RNNoise | Speex |
|---------|----------|---------|-------|
| **Location** | Browser | Browser | Browser |
| **Latency** | 0ms | ~0ms | ~0ms |
| **Quality** | Basic | Limited | Good |
| **Setup** | Simple | Simple | Simple |
| **Backend** | No | No | No |
| **License** | N/A | Open-source | BSD (open-source) |
| **Real-time** | ✅ | ✅ | ✅ |
| **Reliability** | High | Low (VAD issues) | High |

## Demo 3: Speex (NEW)

### Overview
Open-source noise suppression using Speex DSP library via WebAssembly.

### Features
- ✅ Real-time noise suppression
- ✅ Browser-based (WebAssembly)
- ✅ Toggle on/off during calls
- ✅ Zero latency
- ✅ No backend required
- ✅ Open-source (BSD license)
- ✅ Proven technology (VoIP standard)

### When to Use
- Live call scenarios
- Low-latency requirements
- Browser-only environments
- Production deployments

### Pros
- Zero latency overhead
- Runs entirely in browser
- No backend required
- Better than RNNoise
- Open-source and free
- Proven technology

### Cons
- Not as sophisticated as AI models
- Fixed algorithm (no customization)

## Recommendation by Use Case

### Live Calls → Speex
Best choice for real-time calls. Reliable, proven, no backend.

### Testing → Baseline
Start here to understand core SDK functionality.

### Experimentation → RNNoise
Try it, but expect VAD issues.

## Setup Comparison

### Baseline
```bash
cd react-demo-app
npm run dev
```

### RNNoise
```bash
cd react-demo-rnnoise
npm run dev
```

### Speex
```bash
cd react-demo-clearervoice
npm install  # First time only
npm run dev
```

## Performance

| Demo | Latency | Memory | CPU |
|------|---------|--------|-----|
| Baseline | 0ms | ~100MB | Low |
| RNNoise | ~0ms | ~200MB | Medium |
| Speex | ~0ms | ~150MB | Medium |

## Visual Identification

- **Baseline**: "Genesys Cloud WebRTC SDK"
- **RNNoise**: "...with RNNoise Voice Isolation"
- **Speex**: "...with Speex Noise Suppression"

## Switching

Use the demo switcher:
```bash
./switch-demo.sh
```

Or manually stop/start demos and refresh browser.

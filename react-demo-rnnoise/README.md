# Genesys Cloud WebRTC SDK Demo App - RNNoise Voice Isolation

### Overview

This demo application showcases the Genesys Cloud WebRTC SDK with **RNNoise-based noise suppression** for advanced voice isolation. Built using React, TypeScript, and Vite.

### Voice Isolation Technology

**RNNoise** - Recurrent Neural Network-based noise suppression
- **Source**: Jitsi WASM wrapper of Xiph.Org's RNNoise
- **License**: BSD-3-Clause (Commercial use allowed)
- **Performance**: Low latency, real-time processing
- **Size**: ~100KB footprint
- **Integration**: AudioWorklet for optimal performance

### Features

Implemented functionality:
- WebRTC Softphone (inbound/outbound)
- Media/device management
- **RNNoise noise suppression toggle**
- Real-time audio processing with minimal latency

### Authentication
In order to access the demo app, a Genesys Cloud token is required - after initial authentication, users can be implicitly authenticated and can bypass the manual authentication.

### Installation & Local Development
```bash
cd react-demo-rnnoise
npm install
npm run dev
```

The app will run on **https://localhost:8444/**

If testing locally made changes within the SDK, you must build the SDK first.
```sh
# SDK
npm run build
# Demo app
cd react-demo-rnnoise
npm install
npm run dev
```

### Comparison

To compare with other voice isolation solutions:
- **Baseline** (no processing): https://localhost:8443/
- **RNNoise** (this demo): https://localhost:8444/
- **DeepFilterNet3**: https://localhost:8445/
- **ClearerVoice**: https://localhost:8446/

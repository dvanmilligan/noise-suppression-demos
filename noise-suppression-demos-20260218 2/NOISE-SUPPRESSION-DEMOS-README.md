# Genesys Cloud WebRTC SDK - Noise Suppression Demo Suite

## Quick Start

### Automated Setup (Recommended)
```bash
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk
./install.sh
```

The installer will guide you through setup and start a demo automatically.

### Manual Setup
See [SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md) for detailed manual setup steps.

---

## Overview

This package contains four demonstration applications showcasing different noise suppression technologies integrated with the Genesys Cloud WebRTC SDK. Each demo provides a complete softphone implementation with advanced audio processing capabilities.

## Project Structure

```
genesys-cloud-webrtc-sdk/
├── react-demo-app/              # Baseline Demo (Browser Native)
├── react-demo-clearervoice/     # Speex Demo (Open-source)
├── react-demo-rnnoise/          # RNNoise Demo (AI-based)
├── react-demo-deepfilternet/    # DeepFilterNet Demo (Coming Soon)
├── src/                         # Core WebRTC SDK source
├── doc/                         # SDK documentation
└── [Root documentation files]   # Setup and integration guides
```

## Demo Applications

### 1. Baseline Demo (`react-demo-app/`)
**Technology**: Browser's built-in noise suppression  
**Port**: 8443  
**Status**: Production-ready

The reference implementation using standard WebRTC with browser-native noise suppression. This serves as the baseline for comparing other noise suppression technologies.

**Features**:
- Standard WebRTC implementation
- Browser's built-in noise suppression
- Full softphone functionality
- Audio recording and comparison
- Advanced microphone settings

**Website**: [MDN Web Docs - Noise Suppression](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/noiseSuppression)

### 2. Speex Demo (`react-demo-clearervoice/`)
**Technology**: Speex noise suppression (via @sapphi-red/web-noise-suppressor)  
**Port**: 8443  
**Status**: Production-ready

Open-source Speex-based noise suppression running entirely in the browser with zero latency.

**Features**:
- Real-time browser-based processing
- Zero backend dependencies
- BSD-licensed open-source
- Audio visualization and metrics
- Side-by-side audio comparison (raw vs processed)
- Configurable settings panel

**Website**: [Speex Official Site](https://www.speex.org/)

**Key Files**:
- `src/utils/speexProcessor.ts` - Speex audio processing implementation
- `src/components/SpeexNoiseSuppress.tsx` - Main UI component
- `src/components/SpeexSettings.tsx` - Configuration panel
- `src/components/CallRecorder.tsx` - Audio recording functionality

### 3. RNNoise Demo (`react-demo-rnnoise/`)
**Technology**: RNNoise (Recurrent Neural Network-based)  
**Port**: 8443  
**Status**: Experimental

AI-based noise suppression using RNNoise. Note: Current implementation has VAD (Voice Activity Detection) limitations.

**Features**:
- AI-based noise suppression
- Real-time audio processing
- VAD metrics and visualization
- Experimental UI controls

**Known Issues**:
- VAD consistently returns 0.000 (doesn't recognize audio as voice)
- Recommend using browser's built-in noise suppression instead
- See `FINAL-RNNOISE-CONCLUSION.md` for details

**Website**: [RNNoise Demo](https://jmvalin.ca/demo/rnnoise/)

**Key Files**:
- `public/rnnoise-worklet-processor.js` - AudioWorklet processor
- `src/utils/rnnoiseProcessor.ts` - RNNoise integration
- `src/components/VoiceIsolation.tsx` - Main UI component
- `src/components/RNNoiseSettings.tsx` - Configuration panel

### 4. DeepFilterNet Demo (`react-demo-deepfilternet/`)
**Technology**: DeepFilterNet (Deep Learning)  
**Port**: 8443  
**Status**: Coming Soon

State-of-the-art deep learning noise suppression. Placeholder for future implementation.

**Website**: [DeepFilterNet GitHub](https://github.com/Rikorose/DeepFilterNet)

## Quick Start

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Genesys Cloud account with WebRTC permissions
- OAuth client credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd genesys-cloud-webrtc-sdk
```

2. Install root dependencies:
```bash
npm install
```

3. Install demo dependencies:
```bash
# Baseline Demo
cd react-demo-app && npm install && cd ..

# Speex Demo
cd react-demo-clearervoice && npm install && cd ..

# RNNoise Demo
cd react-demo-rnnoise && npm install && cd ..
```

### Running a Demo

Each demo runs on port 8443 (required for OAuth). Only one demo can run at a time.

**Option 1: Manual Start**
```bash
cd react-demo-app  # or react-demo-clearervoice, react-demo-rnnoise
npm run dev
```

**Option 2: Using Demo Switcher**
1. Start any demo
2. Open https://localhost:8443 in your browser
3. Click "Switch Demo" in the UI
4. Copy the command for your desired demo
5. Run the command in your terminal
6. Refresh the browser

**Option 3: Using Launch Script**
```bash
./launch-demo.sh
# Select demo from interactive menu
```

### Configuration

Each demo requires OAuth configuration. Create or update the config file:

**Location**: `react-demo-<name>/public/config.json`

```json
{
  "clientId": "your-oauth-client-id",
  "redirectUri": "https://localhost:8443",
  "environment": "mypurecloud.com"
}
```

## Shared Components

All demos share common components for consistency:

### Core Components
- **DemoSwitcher** - Switch between demos with collapsible UI
- **Header** - Genesys Cloud branding and title
- **Devices** - Audio/video device selection
- **Softphone** - Call controls and status
- **AdvancedMicSettings** - Microphone configuration (AGC, echo cancellation, etc.)
- **DiagnosticExport** - Export logs and diagnostics
- **CallRecorder** - Record and compare raw vs processed audio

### Styling
- Genesys Spark Design System
- Consistent component order across all demos
- Responsive layouts
- Collapsible sections to reduce scrolling

## Architecture

### Audio Processing Flow

```
Microphone Input
    ↓
getUserMedia() with SDK constraints
    ↓
[Noise Suppression Processing]
    ├─ Baseline: Browser native
    ├─ Speex: AudioWorklet processor
    └─ RNNoise: AudioWorklet processor
    ↓
WebRTC PeerConnection
    ↓
Genesys Cloud Platform
```

### Key Integration Points

1. **SDK Initialization** (`src/utils/sdk.ts`)
   - Configure WebRTC SDK
   - Set up media constraints
   - Handle authentication

2. **Audio Processing** (`src/utils/*Processor.ts`)
   - Initialize noise suppression
   - Create AudioWorklet nodes
   - Process audio streams

3. **Stream Management**
   - Use `sdk.setDefaultAudioStream()` for custom processing
   - Handle stream switching
   - Manage recording streams

## Development Guide

### Adding a New Demo

1. Copy an existing demo folder (e.g., `react-demo-app`)
2. Update `package.json` name and dependencies
3. Implement noise suppression in `src/utils/`
4. Create UI components in `src/components/`
5. Update `DemoSwitcher.tsx` in all demos to include new demo
6. Add documentation

### Testing

Each demo includes:
- TypeScript type checking
- ESLint for code quality
- Vite dev server with HMR
- Production build validation

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

### Common Issues

**Port 8443 already in use**:
```bash
# Kill process on port 8443
lsof -ti :8443 | xargs kill -9
```

**OAuth redirect mismatch**:
- Ensure `redirectUri` in config.json matches OAuth client settings
- Must use `https://localhost:8443`

**Audio not processing**:
- Check browser console for errors
- Verify microphone permissions
- Ensure noise suppression is enabled in UI

## File Organization

### Documentation Files (Root)

**Keep**:
- `README.md` - Main SDK documentation
- `changelog.md` - Version history
- `LICENSE` - License information
- `NOISE-SUPPRESSION-DEMOS-README.md` - This file

**Archive** (move to `docs/archive/`):
- `ABOUT-SECTIONS-ADDED.md`
- `ADVANCED-MIC-SETTINGS-INTEGRATION.md`
- `AUDIO-PLAYER-CONTROLS-ADDED.md`
- `CALL-RECORDER-AND-DEMO-SWITCHER-IMPROVEMENTS.md`
- `CLEARERVOICE-INTEGRATION-COMPLETE.md`
- `DEMO-APPS-OVERVIEW.md`
- `DEMO-COMPARISON-SPEEX.md`
- `DEMO-COMPARISON.md`
- `DEMO-CONSISTENCY-COMPLETE.md`
- `DEMO-CONSISTENCY-PLAN.md`
- `DEMO-LAUNCHER-README.md`
- `FINAL-RNNOISE-CONCLUSION.md`
- `INTEGRATED-DEMO-LAUNCHER.md`
- `RNNOISE-DEMO-FEATURES.md`
- `RNNOISE-SUMMARY.md`
- `RNNOISE-UI-CONTROLS.md`
- `SPEEX-ENHANCED-UI.md`
- `SPEEX-FIX-COMPLETE.md`
- `SPEEX-FIXES-AND-LAUNCHER.md`
- `SPEEX-INTEGRATION-COMPLETE.md`
- `SPEEX-INTEGRATION-SUMMARY.md`
- `SWITCHING-DEMOS.md`
- `TOGGLE-DUPLICATE-EVENT-FIX.md`

**Remove**:
- `demo-launcher.html` - Functionality integrated into demos
- `demo-launcher.js` - Functionality integrated into demos
- `switch-demo.sh` - Replaced by integrated switcher

### Demo-Specific Files

Each demo should contain:
- `README.md` - Demo-specific documentation
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `src/` - Source code
- `public/` - Static assets

## API Reference

### Speex Processor

```typescript
import { initializeSpeex, cleanupSpeex } from './utils/speexProcessor';

// Initialize
const processedStream = await initializeSpeex(originalStream);

// Cleanup
cleanupSpeex();

// Get metrics
const audioLevel = getAudioLevel();
const framesProcessed = getProcessedFrames();
```

### RNNoise Processor

```typescript
import { initializeRNNoise, cleanupRNNoise } from './utils/rnnoiseProcessor';

// Initialize
const processedStream = await initializeRNNoise(originalStream);

// Get VAD
const vadProbability = getVADProbability();

// Cleanup
cleanupRNNoise();
```

### Audio Recorder

```typescript
import { startRecording, stopRecording } from './utils/audioRecorder';

// Start recording both streams
startRecording(rawStream, processedStream, metadata);

// Stop and get recordings
const recordings = await stopRecording();
// Returns: { raw: Blob, processed: Blob, metadata: object }
```

## Performance Considerations

### Speex
- **Latency**: <10ms
- **CPU Usage**: Low (~5-10%)
- **Memory**: ~20MB
- **Browser Support**: Chrome, Firefox, Edge, Safari

### RNNoise
- **Latency**: ~10-20ms
- **CPU Usage**: Medium (~15-25%)
- **Memory**: ~30MB
- **Browser Support**: Chrome, Firefox, Edge (limited Safari)

### Baseline
- **Latency**: Minimal
- **CPU Usage**: Minimal
- **Memory**: Minimal
- **Browser Support**: All modern browsers

## Browser Compatibility

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Baseline | ✅ | ✅ | ✅ | ✅ |
| Speex | ✅ | ✅ | ✅ | ⚠️ |
| RNNoise | ✅ | ✅ | ✅ | ❌ |
| AudioWorklet | ✅ | ✅ | ✅ | ⚠️ |
| Recording | ✅ | ✅ | ✅ | ✅ |

✅ Full support | ⚠️ Partial support | ❌ Not supported

## Troubleshooting

### Audio Issues
1. Check microphone permissions in browser
2. Verify correct device selected in Devices panel
3. Check browser console for errors
4. Try disabling/re-enabling noise suppression

### Build Issues
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check Node.js version: `node --version`

### OAuth Issues
1. Verify client ID and redirect URI
2. Check OAuth client permissions in Genesys Cloud
3. Ensure using https://localhost:8443

## Contributing

When contributing to the demos:

1. Maintain consistency across all demos
2. Update all DemoSwitcher components when adding features
3. Follow TypeScript best practices
4. Test on multiple browsers
5. Update documentation

## License

See LICENSE file in root directory.

## Support

For issues related to:
- **Genesys Cloud WebRTC SDK**: See main README.md
- **Demo Applications**: Create an issue with demo-specific label
- **Noise Suppression Libraries**: Refer to respective library documentation

## Additional Resources

- [Genesys Cloud Developer Center](https://developer.genesys.cloud/)
- [WebRTC SDK Documentation](./doc/index.md)
- [Speex Documentation](https://www.speex.org/docs/)
- [RNNoise Paper](https://jmvalin.ca/demo/rnnoise/)
- [DeepFilterNet Paper](https://github.com/Rikorose/DeepFilterNet)

## Version History

See individual demo README files and root changelog.md for version-specific changes.

---

**Last Updated**: 2026-02-18  
**Maintainer**: Genesys Cloud WebRTC SDK Team

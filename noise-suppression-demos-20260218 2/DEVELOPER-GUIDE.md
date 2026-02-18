# Developer Guide - Noise Suppression Demos

## For Senior Developers Reviewing This Project

This guide provides a technical deep-dive into the noise suppression demo implementations, architecture decisions, and areas for improvement.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Demo Implementations](#demo-implementations)
3. [Shared Components](#shared-components)
4. [Audio Processing Pipeline](#audio-processing-pipeline)
5. [Known Issues & Limitations](#known-issues--limitations)
6. [Improvement Opportunities](#improvement-opportunities)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Considerations](#deployment-considerations)

## Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.x
- **UI Library**: Genesys Spark Components
- **WebRTC SDK**: Genesys Cloud WebRTC SDK (custom build)
- **Audio Processing**: Web Audio API + AudioWorklet
- **State Management**: React hooks (useState, useEffect, useRef)

### Project Structure

```
genesys-cloud-webrtc-sdk/
├── src/                          # Core WebRTC SDK (TypeScript)
│   ├── client.ts                 # Main SDK client
│   ├── media/                    # Media handling
│   ├── sessions/                 # Session management
│   └── types/                    # TypeScript definitions
│
├── react-demo-app/               # Baseline Demo
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Dashboard.tsx     # Main container
│   │   │   ├── Softphone.tsx     # Call controls
│   │   │   ├── Devices.tsx       # Device selection
│   │   │   ├── AdvancedMicSettings.tsx
│   │   │   ├── DemoSwitcher.tsx  # Demo navigation
│   │   │   └── DiagnosticExport.tsx
│   │   ├── utils/
│   │   │   └── sdk.ts            # SDK initialization
│   │   └── types/
│   │       └── sdk.ts            # Type definitions
│   └── public/
│       └── config.json           # OAuth configuration
│
├── react-demo-clearervoice/      # Speex Demo
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpeexNoiseSuppress.tsx  # Main UI
│   │   │   ├── SpeexSettings.tsx       # Config panel
│   │   │   ├── CallRecorder.tsx        # Recording
│   │   │   └── [shared components]
│   │   └── utils/
│   │       ├── speexProcessor.ts       # Audio processing
│   │       └── audioRecorder.ts        # Recording logic
│   └── package.json              # Includes @sapphi-red/web-noise-suppressor
│
└── react-demo-rnnoise/           # RNNoise Demo
    ├── src/
    │   ├── components/
    │   │   ├── VoiceIsolation.tsx      # Main UI
    │   │   ├── RNNoiseSettings.tsx     # Config panel
    │   │   └── [shared components]
    │   └── utils/
    │       └── rnnoiseProcessor.ts     # Audio processing
    └── public/
        └── rnnoise-worklet-processor.js # AudioWorklet
```

## Demo Implementations

### 1. Baseline Demo (Browser Native)

**Implementation**: `react-demo-app/`

Uses browser's built-in noise suppression via MediaTrackConstraints:

```typescript
const constraints = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true
  }
};

const stream = await navigator.mediaDevices.getUserMedia(constraints);
```

**Pros**:
- Zero overhead
- Consistent across browsers
- No additional dependencies
- Reliable and well-tested

**Cons**:
- Limited control over algorithm
- Quality varies by browser
- No access to processing metrics

### 2. Speex Demo (Open-Source)

**Implementation**: `react-demo-clearervoice/`

Uses `@sapphi-red/web-noise-suppressor` package (Speex-based):

```typescript
// speexProcessor.ts
import { NoiseSuppressor } from '@sapphi-red/web-noise-suppressor';

let suppressor: NoiseSuppressor | null = null;
let analyserNode: AnalyserNode | null = null;

export async function initializeSpeex(inputStream: MediaStream): Promise<MediaStream> {
  const audioContext = new AudioContext({ sampleRate: 48000 });
  const source = audioContext.createMediaStreamSource(inputStream);
  
  // Initialize Speex suppressor
  suppressor = await NoiseSuppressor.create(audioContext, {
    maxChannels: 2  // Stereo support
  });
  
  // Create audio graph
  source.connect(suppressor.input);
  
  // Add analyser for visualization
  analyserNode = audioContext.createAnalyser();
  suppressor.output.connect(analyserNode);
  
  // Create output stream
  const destination = audioContext.createMediaStreamDestination();
  suppressor.output.connect(destination);
  
  return destination.stream;
}
```

**Key Features**:
- Real-time processing with AudioWorklet
- Stereo audio support (maxChannels: 2)
- Audio level visualization
- Frame counter for monitoring
- Zero backend dependencies

**Pros**:
- Open-source (BSD license)
- Low latency (<10ms)
- Good noise reduction
- Browser-based (no server needed)
- Configurable parameters

**Cons**:
- Additional CPU usage (~5-10%)
- Requires AudioWorklet support
- Limited Safari compatibility

**Integration with SDK**:

```typescript
// In Dashboard.tsx
const handleSpeexToggle = async (enabled: boolean) => {
  if (enabled) {
    const originalStream = await navigator.mediaDevices.getUserMedia({
      audio: { ...sdkConstraints }
    });
    
    const processedStream = await initializeSpeex(originalStream);
    
    // Set as default stream for SDK
    sdk.setDefaultAudioStream(processedStream);
  } else {
    cleanupSpeex();
    sdk.setDefaultAudioStream(null);
  }
};
```

### 3. RNNoise Demo (AI-Based)

**Implementation**: `react-demo-rnnoise/`

Uses RNNoise WASM module with AudioWorklet:

```typescript
// rnnoiseProcessor.ts
export async function initializeRNNoise(inputStream: MediaStream): Promise<MediaStream> {
  const audioContext = new AudioContext({ sampleRate: 48000 });
  
  // Load AudioWorklet module
  await audioContext.audioWorklet.addModule('/rnnoise-worklet-processor.js');
  
  // Create worklet node
  const rnnoiseNode = new AudioWorkletNode(audioContext, 'rnnoise-processor');
  
  // Connect audio graph
  const source = audioContext.createMediaStreamSource(inputStream);
  source.connect(rnnoiseNode);
  
  const destination = audioContext.createMediaStreamDestination();
  rnnoiseNode.connect(destination);
  
  return destination.stream;
}
```

**AudioWorklet Processor** (`public/rnnoise-worklet-processor.js`):

```javascript
class RNNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.rnnoiseState = null;
    this.initialized = false;
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!this.initialized || !input[0]) {
      return true;
    }
    
    // Process audio through RNNoise
    const vadProbability = this.processFrame(input[0], output[0]);
    
    // Send VAD to main thread
    this.port.postMessage({ vad: vadProbability });
    
    return true;
  }
}
```

**Known Issues**:
- VAD (Voice Activity Detection) always returns 0.000
- Doesn't recognize audio as voice
- Noise suppression effectiveness is limited
- See `docs/archive/FINAL-RNNOISE-CONCLUSION.md` for analysis

**Recommendation**: Use browser's built-in noise suppression instead until VAD issue is resolved.

## Shared Components

### DemoSwitcher Component

**Purpose**: Navigate between demos with terminal commands

**Key Features**:
- Collapsible UI (default: collapsed)
- Shows current demo
- Provides copy-to-clipboard commands
- Includes reference links to technology websites
- Greys out coming-soon demos

**Implementation Pattern**:

```typescript
const demos: Demo[] = [
  {
    id: 'baseline',
    name: 'Baseline Demo',
    status: 'active',  // or 'available', 'coming-soon'
    command: 'cd ~/kiro/genesys-cloud-webrtc-sdk && lsof -ti :8443 | xargs kill -9 2>/dev/null; cd react-demo-app && npm run dev',
    website: 'https://...'
  },
  // ...
];
```

**CSS Considerations**:
- Uses `pointer-events: none` on coming-soon cards
- Re-enables `pointer-events: auto` on website links
- Ensures links are clickable even when card is greyed out

### CallRecorder Component

**Purpose**: Record and compare raw vs processed audio

**Architecture**:

```typescript
// audioRecorder.ts
let rawRecorder: MediaRecorder | null = null;
let processedRecorder: MediaRecorder | null = null;

export function startRecording(
  rawStream: MediaStream,
  processedStream: MediaStream,
  metadata: RecordingMetadata
) {
  rawRecorder = new MediaRecorder(rawStream);
  processedRecorder = new MediaRecorder(processedStream);
  
  // Collect chunks
  rawRecorder.ondataavailable = (e) => rawChunks.push(e.data);
  processedRecorder.ondataavailable = (e) => processedChunks.push(e.data);
  
  rawRecorder.start();
  processedRecorder.start();
}

export async function stopRecording(): Promise<RecordingResult> {
  // Stop recorders and create blobs
  const rawBlob = new Blob(rawChunks, { type: 'audio/webm' });
  const processedBlob = new Blob(processedChunks, { type: 'audio/webm' });
  
  return { raw: rawBlob, processed: processedBlob, metadata };
}
```

**UI Features**:
- Side-by-side audio players
- Metadata display (timestamp, browser NS status, etc.)
- Download all recordings as ZIP
- Compact horizontal layout

### AdvancedMicSettings Component

**Purpose**: Configure microphone constraints

**Supported Settings**:
- Auto Gain Control (AGC)
- Echo Cancellation
- Noise Suppression (browser native)
- Sample Rate
- Channel Count

**Implementation**:

```typescript
const applySettings = async () => {
  const constraints = {
    audio: {
      autoGainControl: agcEnabled,
      echoCancellation: echoCancellationEnabled,
      noiseSuppression: noiseSuppression Enabled,
      sampleRate: { ideal: sampleRate },
      channelCount: { ideal: channelCount }
    }
  };
  
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
  // Verify actual settings
  const track = stream.getAudioTracks()[0];
  const settings = track.getSettings();
  
  if (settings.noiseSuppression !== noiseSuppressionEnabled) {
    console.warn('Browser NS mismatch:', settings.noiseSuppression);
  }
  
  sdk.updateOutgoingMedia({ audio: stream });
};
```

## Audio Processing Pipeline

### Complete Flow

```
1. Microphone Input
   └─> navigator.mediaDevices.getUserMedia()

2. Apply SDK Constraints
   └─> AGC, Echo Cancellation, Sample Rate, etc.

3. Noise Suppression Processing
   ├─> Baseline: Browser native (in getUserMedia)
   ├─> Speex: AudioContext → NoiseSuppressor → Destination
   └─> RNNoise: AudioContext → AudioWorklet → Destination

4. Recording (if enabled)
   ├─> Raw Stream → MediaRecorder
   └─> Processed Stream → MediaRecorder

5. WebRTC PeerConnection
   └─> sdk.setDefaultAudioStream(processedStream)

6. Genesys Cloud Platform
   └─> Remote peer receives processed audio
```

### AudioContext Management

**Important Considerations**:

1. **Sample Rate**: Always use 48000 Hz for consistency
   ```typescript
   const audioContext = new AudioContext({ sampleRate: 48000 });
   ```

2. **Stereo vs Mono**: 
   - Speex: Use `maxChannels: 2` for stereo
   - RNNoise: Currently mono only

3. **Latency**: 
   - Speex: ~5-10ms
   - RNNoise: ~10-20ms
   - Browser native: <5ms

4. **Cleanup**: Always disconnect nodes and close context
   ```typescript
   export function cleanup() {
     if (source) source.disconnect();
     if (suppressor) suppressor.disconnect();
     if (audioContext) audioContext.close();
   }
   ```

## Known Issues & Limitations

### 1. RNNoise VAD Issue

**Problem**: Voice Activity Detection always returns 0.000

**Root Cause**: RNNoise model doesn't recognize the audio as voice

**Attempted Fixes**:
- Gain adjustments (2x, 4x, 8x)
- VAD compensation
- Different audio sources
- Model retraining (not feasible)

**Status**: Unresolved - recommend using browser NS instead

**Reference**: `docs/archive/FINAL-RNNOISE-CONCLUSION.md`

### 2. Safari AudioWorklet Support

**Problem**: Limited AudioWorklet support in Safari

**Workaround**: Feature detection and fallback to browser NS

```typescript
if (!window.AudioWorklet) {
  console.warn('AudioWorklet not supported, using browser NS');
  return originalStream;
}
```

### 3. Port 8443 Requirement

**Problem**: OAuth requires https://localhost:8443

**Impact**: Only one demo can run at a time

**Solution**: Demo switcher with port cleanup commands

### 4. Stereo Audio in Speex

**Problem**: Initial implementation used mono (maxChannels: 1)

**Fix**: Changed to stereo (maxChannels: 2)

**Impact**: Resolved "audio only from left speaker" issue

## Improvement Opportunities

### High Priority

1. **Implement DeepFilterNet Demo**
   - Research browser-compatible implementation
   - May require WASM compilation
   - Consider WebGPU for acceleration

2. **Add Automated Testing**
   - Unit tests for audio processors
   - Integration tests for SDK interactions
   - E2E tests for demo workflows

3. **Performance Monitoring**
   - Add CPU usage metrics
   - Memory profiling
   - Latency measurements
   - Real-time performance dashboard

4. **Error Handling**
   - Better error messages
   - Graceful degradation
   - Automatic fallback to browser NS

### Medium Priority

5. **Configuration Persistence**
   - Save user preferences to localStorage
   - Remember last used demo
   - Persist mic settings

6. **Audio Quality Metrics**
   - SNR (Signal-to-Noise Ratio) calculation
   - Frequency analysis
   - Comparison charts

7. **Mobile Support**
   - Responsive design improvements
   - Touch-friendly controls
   - Mobile browser compatibility

8. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

### Low Priority

9. **Advanced Features**
   - Multiple noise suppression profiles
   - Custom RNNoise model training
   - A/B testing framework

10. **Documentation**
    - API documentation with TypeDoc
    - Video tutorials
    - Interactive examples

## Testing Strategy

### Current State

- Manual testing only
- No automated test suite
- Browser compatibility tested manually

### Recommended Approach

#### Unit Tests (Jest + Testing Library)

```typescript
// speexProcessor.test.ts
describe('Speex Processor', () => {
  it('should initialize with valid stream', async () => {
    const mockStream = createMockMediaStream();
    const result = await initializeSpeex(mockStream);
    expect(result).toBeInstanceOf(MediaStream);
  });
  
  it('should cleanup resources', () => {
    cleanupSpeex();
    expect(getAudioLevel()).toBe(0);
  });
});
```

#### Integration Tests

```typescript
// sdk-integration.test.ts
describe('SDK Integration', () => {
  it('should set default audio stream', async () => {
    const stream = await initializeSpeex(mockStream);
    sdk.setDefaultAudioStream(stream);
    expect(sdk.getDefaultAudioStream()).toBe(stream);
  });
});
```

#### E2E Tests (Playwright/Cypress)

```typescript
// demo-switcher.e2e.ts
test('should switch between demos', async ({ page }) => {
  await page.goto('https://localhost:8443');
  await page.click('[data-testid="demo-switcher"]');
  await page.click('[data-testid="speex-demo"]');
  // Verify command displayed
  await expect(page.locator('.command-box')).toContainText('react-demo-clearervoice');
});
```

## Deployment Considerations

### Production Checklist

- [ ] Remove development documentation
- [ ] Clean build artifacts
- [ ] Update OAuth configuration
- [ ] Test on target browsers
- [ ] Verify HTTPS certificates
- [ ] Check CSP headers
- [ ] Enable production builds
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up monitoring
- [ ] Document deployment process

### Environment Variables

```bash
# .env.production
VITE_CLIENT_ID=your-production-client-id
VITE_REDIRECT_URI=https://your-domain.com
VITE_ENVIRONMENT=mypurecloud.com
```

### Build Commands

```bash
# Build all demos
npm run build

# Build specific demo
cd react-demo-clearervoice && npm run build

# Preview production build
npm run preview
```

### Hosting Requirements

- HTTPS required (OAuth)
- Support for SPA routing
- WebSocket support (WebRTC)
- CORS configuration
- Content Security Policy

### Recommended Hosting

- **Vercel**: Easy deployment, automatic HTTPS
- **Netlify**: Similar to Vercel
- **AWS S3 + CloudFront**: More control
- **Self-hosted**: Nginx/Apache with Let's Encrypt

## Code Quality

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### ESLint Rules

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Code Review Checklist

- [ ] TypeScript types are accurate
- [ ] No `any` types
- [ ] Error handling is comprehensive
- [ ] Resources are cleaned up properly
- [ ] Components are properly memoized
- [ ] No memory leaks
- [ ] Accessibility is considered
- [ ] Documentation is updated

## Performance Optimization

### React Optimization

```typescript
// Use memo for expensive components
const SpeexNoiseSuppress = React.memo(({ sdk }) => {
  // Component logic
});

// Use useCallback for event handlers
const handleToggle = useCallback((enabled: boolean) => {
  // Handler logic
}, [dependencies]);

// Use useMemo for expensive calculations
const audioLevel = useMemo(() => {
  return calculateAudioLevel(data);
}, [data]);
```

### Audio Processing Optimization

```typescript
// Reuse AudioContext
let globalAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioContext) {
    globalAudioContext = new AudioContext({ sampleRate: 48000 });
  }
  return globalAudioContext;
}

// Use OfflineAudioContext for non-realtime processing
const offlineContext = new OfflineAudioContext(2, 48000 * duration, 48000);
```

## Security Considerations

### OAuth Security

- Store tokens securely (not in localStorage)
- Use PKCE flow
- Implement token refresh
- Validate redirect URIs

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://*.mypurecloud.com; 
               media-src 'self' blob:;">
```

### Input Validation

```typescript
// Validate user input
function validateSampleRate(rate: number): boolean {
  const validRates = [8000, 16000, 24000, 48000];
  return validRates.includes(rate);
}
```

## Conclusion

This project demonstrates three different approaches to noise suppression in WebRTC applications:

1. **Baseline**: Reliable, zero-overhead browser native
2. **Speex**: Open-source, configurable, good performance
3. **RNNoise**: AI-based, experimental, needs improvement

The architecture is modular and extensible, making it easy to add new noise suppression technologies or improve existing implementations.

### Next Steps for Reviewers

1. Review audio processing implementations
2. Test on multiple browsers and devices
3. Evaluate performance characteristics
4. Identify security concerns
5. Suggest architectural improvements
6. Propose testing strategy
7. Review documentation completeness

### Questions for Discussion

1. Should we implement DeepFilterNet or explore other technologies?
2. What's the best approach for automated testing?
3. How should we handle browser compatibility issues?
4. What metrics should we track in production?
5. Should we support mobile browsers?

---

**For Questions or Feedback**: Please create an issue or contact the development team.

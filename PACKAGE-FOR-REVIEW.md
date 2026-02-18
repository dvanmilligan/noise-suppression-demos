# Package for Senior Developer Review

## Quick Start for Reviewers

This package contains noise suppression demos for the Genesys Cloud WebRTC SDK. Follow these steps to review and test.

### Option 1: Automated Setup (Recommended)

```bash
# Extract the package
tar -xzf noise-suppression-demos.tar.gz
cd genesys-cloud-webrtc-sdk

# Run the automated installer
./install.sh
```

The installer will:
- Check Node.js version (v16+ required)
- Install all dependencies
- Prompt for OAuth Client ID
- Configure all demos
- Start a demo automatically

Then open https://localhost:8443 in your browser.

### Option 2: Manual Setup

```bash
# Extract the package
tar -xzf noise-suppression-demos.tar.gz
cd genesys-cloud-webrtc-sdk

# Install root dependencies
npm install

# Install demo dependencies
cd react-demo-app && npm install && cd ..
cd react-demo-clearervoice && npm install && cd ..
cd react-demo-rnnoise && npm install && cd ..
```

Create `react-demo-app/public/config.json`:

```json
{
  "clientId": "your-oauth-client-id",
  "redirectUri": "https://localhost:8443",
  "environment": "mypurecloud.com"
}
```

Copy this file to other demos:
```bash
cp react-demo-app/public/config.json react-demo-clearervoice/public/
cp react-demo-app/public/config.json react-demo-rnnoise/public/
```

Run a demo:
```bash
cd react-demo-clearervoice  # or react-demo-app, react-demo-rnnoise
npm run dev
```

Open https://localhost:8443 in your browser.

## Documentation Structure

### For Quick Overview
1. **NOISE-SUPPRESSION-DEMOS-README.md** - Start here
   - Project overview
   - Demo descriptions
   - Quick start guide
   - API reference

### For Technical Deep-Dive
2. **DEVELOPER-GUIDE.md** - Technical details
   - Architecture decisions
   - Implementation details
   - Known issues
   - Improvement opportunities
   - Testing strategy

### For SDK Integration
3. **README.md** - Original SDK documentation
4. **doc/** - SDK API documentation

### For Historical Context
5. **docs/archive/** - Development documentation
   - Implementation notes
   - Bug fixes
   - Feature additions

## Key Files to Review

### Core Implementations

#### Speex Demo (Recommended Starting Point)
```
react-demo-clearervoice/
├── src/utils/speexProcessor.ts          # Audio processing logic
├── src/utils/audioRecorder.ts           # Recording implementation
├── src/components/SpeexNoiseSuppress.tsx # Main UI component
├── src/components/SpeexSettings.tsx     # Configuration panel
└── src/components/CallRecorder.tsx      # Recording UI
```

#### RNNoise Demo (Has Known Issues)
```
react-demo-rnnoise/
├── public/rnnoise-worklet-processor.js  # AudioWorklet processor
├── src/utils/rnnoiseProcessor.ts        # Integration logic
├── src/components/VoiceIsolation.tsx    # Main UI component
└── src/components/RNNoiseSettings.tsx   # Configuration panel
```

#### Baseline Demo (Reference Implementation)
```
react-demo-app/
├── src/components/Dashboard.tsx         # Main container
├── src/components/Softphone.tsx         # Call controls
└── src/utils/sdk.ts                     # SDK initialization
```

### Shared Components (Used by All Demos)
```
src/components/
├── DemoSwitcher.tsx                     # Demo navigation
├── AdvancedMicSettings.tsx              # Mic configuration
├── DiagnosticExport.tsx                 # Log export
├── Devices.tsx                          # Device selection
└── Header.tsx                           # Branding
```

## Testing Checklist

### Functional Testing

- [ ] **Baseline Demo**
  - [ ] OAuth login works
  - [ ] Can make/receive calls
  - [ ] Browser NS toggle works
  - [ ] Recording works
  - [ ] Device selection works

- [ ] **Speex Demo**
  - [ ] Speex toggle enables/disables
  - [ ] Audio visualization shows activity
  - [ ] Frame counter increments
  - [ ] Recording captures raw + processed
  - [ ] Settings panel is informative

- [ ] **RNNoise Demo**
  - [ ] RNNoise toggle enables/disables
  - [ ] VAD display shows (even if 0.000)
  - [ ] Recording works
  - [ ] Warning about VAD issue is visible

- [ ] **Demo Switcher**
  - [ ] Starts collapsed
  - [ ] Expands on click
  - [ ] Shows correct current demo
  - [ ] Commands copy to clipboard
  - [ ] Website links work
  - [ ] DeepFilterNet is greyed out but link works

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest) - limited support expected

### Performance Testing

- [ ] CPU usage acceptable (<25%)
- [ ] No memory leaks during extended use
- [ ] Audio latency acceptable (<50ms)
- [ ] UI remains responsive

## Review Focus Areas

### 1. Architecture (Priority: High)

**Questions to Consider**:
- Is the separation of concerns clear?
- Are the audio processing implementations efficient?
- Is the SDK integration pattern appropriate?
- Are there better ways to structure the code?

**Files to Review**:
- `src/utils/speexProcessor.ts`
- `src/utils/rnnoiseProcessor.ts`
- `src/components/Dashboard.tsx`

### 2. Audio Processing (Priority: High)

**Questions to Consider**:
- Is the AudioContext usage correct?
- Are resources properly cleaned up?
- Is the audio graph optimal?
- Are there potential memory leaks?

**Files to Review**:
- `react-demo-clearervoice/src/utils/speexProcessor.ts`
- `react-demo-rnnoise/public/rnnoise-worklet-processor.js`

### 3. User Experience (Priority: Medium)

**Questions to Consider**:
- Is the UI intuitive?
- Are error messages helpful?
- Is the demo switcher easy to use?
- Are the settings clear?

**Files to Review**:
- `src/components/DemoSwitcher.tsx`
- `src/components/SpeexNoiseSuppress.tsx`
- `src/components/CallRecorder.tsx`

### 4. Code Quality (Priority: Medium)

**Questions to Consider**:
- Are TypeScript types accurate?
- Is error handling comprehensive?
- Are there code smells?
- Is the code maintainable?

**Run**:
```bash
npm run lint
npm run type-check
```

### 5. Security (Priority: High)

**Questions to Consider**:
- Is OAuth implementation secure?
- Are there XSS vulnerabilities?
- Is user input validated?
- Are tokens handled properly?

**Files to Review**:
- `src/utils/sdk.ts`
- OAuth configuration handling

## Known Issues to Verify

### 1. RNNoise VAD Issue
**Status**: Unresolved  
**Impact**: High  
**Description**: VAD always returns 0.000

**To Verify**:
1. Enable RNNoise in demo
2. Speak into microphone
3. Observe VAD display (should show 0.000)

**Expected**: Should show values between 0.0 and 1.0  
**Actual**: Always shows 0.000

**Reference**: `docs/archive/FINAL-RNNOISE-CONCLUSION.md`

### 2. Safari AudioWorklet Support
**Status**: Known limitation  
**Impact**: Medium  
**Description**: Limited AudioWorklet support in Safari

**To Verify**:
1. Open Speex demo in Safari
2. Try to enable Speex
3. Check console for errors

**Expected**: May not work or have degraded performance

### 3. Stereo Audio in Speex
**Status**: Fixed  
**Impact**: Low  
**Description**: Was mono, now stereo

**To Verify**:
1. Enable Speex
2. Make a call
3. Verify audio comes from both speakers

**Expected**: Stereo audio  
**Previous Issue**: Audio only from left speaker

## Improvement Suggestions

Please provide feedback on:

1. **Architecture**
   - Better patterns for audio processing?
   - Improved SDK integration?
   - State management alternatives?

2. **Performance**
   - Optimization opportunities?
   - Memory leak concerns?
   - Latency improvements?

3. **Features**
   - Missing functionality?
   - Better user experience?
   - Additional metrics?

4. **Code Quality**
   - Refactoring opportunities?
   - Better TypeScript usage?
   - Testing strategy?

5. **Documentation**
   - Unclear sections?
   - Missing information?
   - Better examples?

## Providing Feedback

### Option 1: Create Issues
Tag issues with appropriate labels:
- `architecture` - Design decisions
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `performance` - Performance issues
- `documentation` - Documentation improvements

### Option 2: Code Review Comments
Add comments directly in the code with:
- `TODO:` - Something that should be done
- `FIXME:` - Something that's broken
- `OPTIMIZE:` - Performance improvement opportunity
- `QUESTION:` - Needs clarification

### Option 3: Written Report
Provide a comprehensive review document covering:
1. Executive summary
2. Architecture assessment
3. Code quality review
4. Security concerns
5. Performance analysis
6. Recommendations

## Next Steps After Review

Based on your feedback, we'll prioritize:

1. **Critical Issues** - Security, major bugs
2. **High Priority** - Architecture improvements, performance
3. **Medium Priority** - UX enhancements, code quality
4. **Low Priority** - Nice-to-have features

## Contact Information

For questions during review:
- Create an issue in the repository
- Contact the development team
- Schedule a review meeting

## Appendix: Command Reference

### Build Commands
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Cleanup Commands
```bash
# Clean build artifacts
rm -rf dist

# Clean node_modules
rm -rf node_modules

# Full cleanup
./cleanup-and-package.sh
```

### Testing Commands
```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

**Thank you for reviewing this project!**

Your expertise and feedback are invaluable for improving the quality and reliability of these noise suppression demos.

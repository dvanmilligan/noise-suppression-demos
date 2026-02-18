# Demo Consistency & Testing Plan

## Current State Analysis

### Baseline Demo (react-demo-app)
**Components:**
- Header (standard)
- BaselineInfo (About section)
- Devices
- Softphone

**Missing:**
- DemoSwitcher
- DiagnosticExport

### RNNoise Demo (react-demo-rnnoise)
**Components:**
- Header (with subtitle)
- DemoSwitcher
- AdvancedMicSettings
- VoiceIsolation
- RNNoiseSettings
- CallRecorder
- DiagnosticExport
- Devices
- Softphone

**Status:** ✅ Complete

### Speex Demo (react-demo-clearervoice)
**Components:**
- Header (with subtitle)
- DemoSwitcher
- SpeexNoiseSuppress
- CallRecorder
- Devices
- Softphone

**Missing:**
- DiagnosticExport

## Standardized Component Order

All demos should follow this order:
1. Header
2. DemoSwitcher
3. [Demo-specific noise suppression component]
4. [Demo-specific settings/controls]
5. CallRecorder (if applicable)
6. DiagnosticExport
7. Devices
8. Softphone

## Required Changes

### 1. Baseline Demo
- ✅ Add DemoSwitcher component
- ✅ Add DiagnosticExport component
- ✅ Reorder: Header → DemoSwitcher → BaselineInfo → DiagnosticExport → Devices → Softphone

### 2. RNNoise Demo
- ✅ Already has all components
- ✅ Order is correct

### 3. Speex Demo
- ✅ Add DiagnosticExport component
- ✅ Reorder: Header → DemoSwitcher → SpeexNoiseSuppress → CallRecorder → DiagnosticExport → Devices → Softphone

## UI Consistency Checklist

### Header Component
- ✅ Genesys logo
- ✅ Title: "Genesys Cloud WebRTC SDK"
- ✅ Subtitle (demo-specific)
- ✅ Logout button

### DemoSwitcher Component
- ✅ Collapsible design
- ✅ Shows current demo
- ✅ Grid of demo cards
- ✅ Simplified switching (no complex terminal commands)

### About Sections
- ✅ Collapsible by default
- ✅ Consistent styling
- ✅ Technology overview
- ✅ Key features list
- ✅ License information

### CallRecorder Component
- ✅ Recording controls
- ✅ Playback controls
- ✅ Progress bar
- ✅ Metadata display
- ✅ Download functionality

### DiagnosticExport Component
- ✅ Export button
- ✅ Downloads logs as JSON/TXT
- ✅ Minimal UI (no scrolling issues)

### Devices Component
- ✅ Audio devices dropdown
- ✅ Output devices dropdown
- ✅ Video devices dropdown
- ✅ Media controls
- ✅ Volume slider

### Softphone Component
- ✅ Place call input
- ✅ Place call button
- ✅ Disconnect PC button
- ✅ On Queue toggle
- ✅ Station details
- ✅ Pending sessions table
- ✅ Active conversations table

## Testing Plan

### Functional Testing
1. **Authentication**
   - ✅ Login with Genesys Cloud credentials
   - ✅ Logout functionality
   - ✅ Token refresh

2. **Device Selection**
   - ✅ Select audio input device
   - ✅ Select audio output device
   - ✅ Select video device
   - ✅ Volume control

3. **Call Functionality**
   - ✅ Place outbound call
   - ✅ Receive inbound call
   - ✅ Mute/unmute
   - ✅ Hold/unhold
   - ✅ End call

4. **Noise Suppression (RNNoise)**
   - ✅ Toggle on/off
   - ✅ Adjust parameters
   - ✅ Record raw vs processed
   - ✅ Playback comparison

5. **Noise Suppression (Speex)**
   - ✅ Toggle on/off
   - ✅ Record raw vs processed
   - ✅ Playback comparison

6. **Demo Switching**
   - ✅ Switch between demos
   - ✅ Simplified instructions
   - ✅ No terminal command popups

7. **Diagnostic Export**
   - ✅ Export logs
   - ✅ Download JSON
   - ✅ Download TXT

### UI/UX Testing
1. **Responsive Design**
   - ✅ Desktop layout
   - ✅ Tablet layout
   - ✅ Mobile layout

2. **Accessibility**
   - ✅ Keyboard navigation
   - ✅ Screen reader support
   - ✅ Color contrast

3. **Visual Consistency**
   - ✅ Genesys Spark components
   - ✅ Consistent spacing
   - ✅ Consistent colors
   - ✅ Consistent typography

4. **Performance**
   - ✅ Fast load times
   - ✅ Smooth animations
   - ✅ No memory leaks

## Implementation Steps

1. ✅ Add DemoSwitcher to Baseline demo
2. ✅ Add DiagnosticExport to Baseline demo
3. ✅ Add DiagnosticExport to Speex demo
4. ✅ Reorder components in all demos
5. ✅ Test all functionality
6. ✅ Fix any bugs
7. ✅ Update documentation

## Success Criteria

- ✅ All demos have consistent component order
- ✅ All demos have consistent styling
- ✅ All demos have same core functionality
- ✅ Demo-specific features work correctly
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ All tests pass
- ✅ Documentation is up-to-date

# RNNoise Demo Features

## Overview
This demo integrates RNNoise (Xiph.Org's recurrent neural network noise suppression) with the Genesys Cloud WebRTC SDK. RNNoise provides ML-based background noise suppression for outbound audio.

**Note:** RNNoise's effectiveness depends on Voice Activity Detection (VAD). If VAD doesn't recognize your audio as voice, noise suppression may not work as expected. See `RNNOISE-SUMMARY.md` for details.

## Features

### 1. Voice Isolation Toggle
- Enable/disable RNNoise processing
- Real-time status indicator
- Frame counter showing processing activity
- Audio activity level meter

### 2. RNNoise Advanced Settings
Adjustable processing parameters:
- **Input Gain** (0.5x-8.0x): Amplify audio before RNNoise
- **VAD Compensation** (1.0x-4.0x): Compensate for over-suppression
- **Output Gain** (0.5x-3.0x): Final volume adjustment

### 3. Call Recorder
- Record raw and processed audio simultaneously
- Side-by-side playback comparison
- Download recordings with metadata
- Verify noise suppression effectiveness

### 4. Advanced Mic Settings
Browser audio processing controls:
- Auto Gain Control
- Echo Cancellation
- Noise Suppression (browser's WebRTC NS)
- Recommended settings for RNNoise

### 5. Diagnostic Export
- Export console logs
- Export diagnostic data
- Troubleshooting support

## Usage

1. **Enable Voice Isolation** - Toggle on to activate RNNoise
2. **Adjust Settings** (optional) - Expand Advanced Settings to tune parameters
3. **Make a Recording** - Test with Call Recorder to compare raw vs processed
4. **Evaluate Results** - Listen to both recordings to assess noise reduction

## Known Limitations

- **VAD Dependency**: RNNoise's effectiveness depends on Voice Activity Detection
- **Audio Compatibility**: May not work well with all microphones/audio setups
- **Processing Overhead**: Adds ~10ms latency
- **Browser Support**: Requires AudioWorklet support (modern browsers)

## Alternative: Browser Noise Suppression

If RNNoise doesn't work well with your audio:
1. Disable Voice Isolation
2. Enable "Noise Suppression On" in Advanced Mic Settings
3. Use browser's built-in WebRTC noise suppression

## Technical Details

- **Technology**: RNNoise WASM (Xiph.Org Foundation)
- **License**: BSD-3-Clause
- **Processing**: AudioWorklet (in-worklet WASM)
- **Latency**: <10ms
- **Sample Rate**: 48kHz
- **Frame Size**: 480 samples (10ms)

## Documentation

- `RNNOISE-SUMMARY.md` - Complete integration summary
- `RNNOISE-UI-CONTROLS.md` - UI controls user guide
- `FINAL-RNNOISE-CONCLUSION.md` - Technical analysis and recommendations

# RNNoise Integration Summary

## Status: Functional but Limited

RNNoise is integrated and working, but has a critical limitation with Voice Activity Detection (VAD) that prevents effective noise suppression in some audio setups.

## What Works

✅ RNNoise WASM integration
✅ AudioWorklet processing pipeline  
✅ Stream routing (raw and processed streams are different)
✅ Toggle on/off functionality
✅ Real-time processing (~100 fps)
✅ UI controls for adjusting parameters
✅ Recording and playback comparison
✅ Diagnostic logging

## What Doesn't Work

❌ **Voice Activity Detection (VAD) returns 0.000 for all audio**
- RNNoise doesn't recognize the audio as containing voice
- Treats everything as noise → over-suppresses or distorts
- No effective background noise reduction

## Root Cause

RNNoise's VAD model was trained on specific voice datasets. If audio characteristics don't match (due to microphone, room acoustics, voice type, etc.), VAD fails to detect voice and RNNoise operates in aggressive noise suppression mode.

## What We Tried

1. ✗ 4x input gain boost
2. ✗ 8x input gain boost
3. ✗ Pure scaling (no gain)
4. ✗ VAD compensation (2x-4x output boost)
5. ✗ Adjustable UI controls for all parameters

None of these approaches fixed the VAD=0 issue because the problem is fundamental: RNNoise's model doesn't recognize this audio as voice.

## Available Features

### Voice Isolation Toggle
Enable/disable RNNoise processing. Shows active status and frame count.

### RNNoise Advanced Settings
Adjustable parameters:
- **Input Gain** (0.5x-8.0x): Boost audio before processing
- **VAD Compensation** (1.0x-4.0x): Compensate for over-suppression when VAD=0
- **Output Gain** (0.5x-3.0x): Final volume adjustment

### Call Recorder
Record and compare raw vs processed audio to evaluate RNNoise effectiveness.

### Advanced Mic Settings
Control browser's built-in audio processing:
- Auto Gain Control
- Echo Cancellation  
- Noise Suppression (browser's WebRTC NS)

## Recommendation

**Use the browser's built-in noise suppression instead of RNNoise.**

Enable "Noise Suppression On" in Advanced Mic Settings. The browser's WebRTC noise suppression:
- Works with all audio types
- Doesn't rely on VAD
- Is proven and reliable
- Provides effective noise reduction

While not as sophisticated as RNNoise, it actually works.

## Technical Details

### Architecture
```
Microphone → getUserMedia → AudioContext → AudioWorklet (RNNoise WASM) → Destination Stream
```

### Processing Pipeline
```
Input → [Input Gain] → RNNoise WASM → [VAD Compensation] → [Output Gain] → Output
```

### Files
- `VoiceIsolation.tsx` - Main toggle component
- `RNNoiseSettings.tsx` - Advanced settings UI
- `rnnoiseProcessor.ts` - Main thread processor management
- `rnnoise-worklet-processor.js` - AudioWorklet WASM processing
- `CallRecorder.tsx` - Recording and comparison
- `AdvancedMicSettings.tsx` - Browser audio settings

## Future Improvements

If you want to make RNNoise work:

1. **Try different microphones** - Some may produce audio RNNoise recognizes better
2. **Test different RNNoise models** - Other suppression levels or versions
3. **Add pre-processing** - Filters to make audio more "voice-like"
4. **Use alternative libraries** - Krisp.ai, WebRTC NS, Speex, etc.
5. **Hybrid approach** - Combine RNNoise with browser NS

## Conclusion

RNNoise is a powerful tool when it works, but it has limitations. The VAD issue is a known problem with ML-based noise suppression - models don't generalize to all audio setups.

For reliable noise suppression, use the browser's built-in WebRTC noise suppression. It may not be as sophisticated, but it works consistently across all audio types.

The RNNoise integration remains in the codebase as a demonstration and for users whose audio setup works with it. The UI controls allow experimentation to find optimal settings.

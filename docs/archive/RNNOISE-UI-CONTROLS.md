# RNNoise UI Controls - User Guide

## New Feature: RNNoise Advanced Settings

I've added a new UI component that lets you adjust RNNoise processing parameters in real-time. This gives you full control to experiment and find the best settings for your audio setup.

## Location

The "RNNoise Advanced Settings" panel appears below the "Voice Isolation" toggle in the dashboard. Click the header to expand/collapse it.

## Available Controls

### 1. Input Gain (0.5x - 8.0x)
**What it does:** Amplifies audio BEFORE RNNoise processes it.

**When to adjust:**
- If VAD consistently shows 0.000, try increasing to 4x-8x
- Higher values may help RNNoise's VAD detect voice
- Too high may cause clipping or distortion

**Default:** 1.0x (no boost)

**Recommended for VAD issues:** 4.0x - 6.0x

### 2. VAD Compensation (1.0x - 4.0x)
**What it does:** Boosts output when VAD is low to counteract over-suppression.

**When to adjust:**
- If processed audio sounds too quiet or muffled
- If VAD=0 and audio is being over-suppressed
- Higher values preserve more audio when VAD fails

**Default:** 2.0x

**Recommended for VAD=0:** 2.0x - 3.0x

### 3. Output Gain (0.5x - 3.0x)
**What it does:** Final volume adjustment after all processing.

**When to adjust:**
- If processed audio is too quiet or too loud
- Fine-tune the final output level
- Independent of RNNoise processing

**Default:** 1.0x (no adjustment)

**Recommended:** 0.8x - 1.5x

## How to Use

### Step 1: Enable Voice Isolation
First, toggle on "Voice Isolation" to activate RNNoise.

### Step 2: Expand Advanced Settings
Click on "RNNoise Advanced Settings" to show the controls.

### Step 3: Adjust Settings
Use the sliders to adjust each parameter. Changes apply immediately.

### Step 4: Test
Make a recording and compare raw vs processed audio to hear the effects.

### Step 5: Iterate
Adjust settings based on results until you find the optimal configuration.

## Recommended Settings for VAD=0 Issue

If your VAD consistently shows 0.000:

**Configuration A (Aggressive):**
- Input Gain: 6.0x
- VAD Compensation: 3.0x
- Output Gain: 1.0x

**Configuration B (Balanced):**
- Input Gain: 4.0x
- VAD Compensation: 2.5x
- Output Gain: 1.2x

**Configuration C (Conservative):**
- Input Gain: 2.0x
- VAD Compensation: 2.0x
- Output Gain: 1.5x

## Console Logs

When you adjust settings, you'll see logs like:
```
[RNNOISE_SETTINGS] Input gain set to 4.0x
[RNNOISE_SETTINGS] VAD compensation set to 2.5x
[RNNOISE_SETTINGS] Output gain set to 1.2x
```

Frame diagnostics will also show current settings:
```
🔇 Frame 300: input=42.4, output=65.9, VAD=0.000, inputGain=4.0, vadCompensation=2.5, outputGain=1.2, reduction=-55.4%, NOISE (COMPENSATED)
```

## Reset to Defaults

Click the "Reset to Defaults" button to restore:
- Input Gain: 1.0x
- VAD Compensation: 2.0x
- Output Gain: 1.0x

## Tips

1. **Start with Input Gain:** If VAD=0, try increasing Input Gain first (4x-6x)

2. **Then adjust VAD Compensation:** If audio is still distorted, increase VAD Compensation (2.5x-3.5x)

3. **Fine-tune with Output Gain:** Use this for final volume adjustments (0.8x-1.5x)

4. **Test incrementally:** Make small changes and test after each adjustment

5. **Watch the console:** VAD values and reduction percentages help diagnose issues

6. **Make recordings:** The best way to evaluate settings is to record and compare

## Understanding the Settings

### Input Gain
- **Low (0.5x-1.0x):** Quieter input, may not help VAD
- **Medium (2.0x-4.0x):** Moderate boost, good starting point
- **High (6.0x-8.0x):** Aggressive boost, may help VAD but risk clipping

### VAD Compensation
- **Low (1.0x-1.5x):** Minimal compensation, trust RNNoise's suppression
- **Medium (2.0x-2.5x):** Balanced compensation for VAD=0
- **High (3.0x-4.0x):** Aggressive compensation, preserves more audio

### Output Gain
- **Low (0.5x-0.8x):** Quieter output
- **Normal (1.0x):** No adjustment
- **High (1.5x-3.0x):** Louder output

## Troubleshooting

### Audio is distorted
- Reduce Input Gain
- Increase VAD Compensation
- Check Output Gain isn't too high

### Audio is too quiet
- Increase Output Gain
- Check VAD Compensation isn't too low
- Verify Input Gain is reasonable

### No noise reduction
- Increase Input Gain (helps VAD detect voice)
- Check VAD values in console
- May need different noise suppression approach

### Audio sounds muffled
- Increase VAD Compensation
- Reduce Input Gain
- Adjust Output Gain

## Technical Details

These settings control the audio processing pipeline:

```
Microphone → [Input Gain] → RNNoise WASM → [VAD Compensation] → [Output Gain] → Output
```

1. **Input Gain:** Multiplies samples before RNNoise
2. **RNNoise:** Processes audio, returns VAD value
3. **VAD Compensation:** Applied when VAD < 0.1
4. **Output Gain:** Final volume adjustment

All processing happens in the AudioWorklet thread for minimal latency.

## Files Modified

- `RNNoiseSettings.tsx` - New UI component
- `RNNoiseSettings.css` - Styling
- `rnnoiseProcessor.ts` - Settings management
- `rnnoise-worklet-processor.js` - Settings application
- `Dashboard.tsx` - Added component to layout

## Next Steps

1. Hard refresh browser (Cmd+Shift+R)
2. Enable Voice Isolation
3. Expand RNNoise Advanced Settings
4. Experiment with different configurations
5. Find what works best for your audio setup

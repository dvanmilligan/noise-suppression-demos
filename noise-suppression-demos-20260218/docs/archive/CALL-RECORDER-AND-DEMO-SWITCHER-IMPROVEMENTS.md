# Call Recorder Added & Demo Switcher Improved ✅

## Summary
1. Added CallRecorder component to Speex demo for testing audio processing
2. Simplified demo switcher to be more user-friendly (no complex terminal instructions)

## Changes Made

### 1. Call Recorder Added to Speex Demo

**Files Created:**
- `react-demo-clearervoice/src/utils/audioRecorder.ts` - Audio recording utility
- `react-demo-clearervoice/src/components/CallRecorder.tsx` - Recording UI component
- `react-demo-clearervoice/src/components/CallRecorder.css` - Styling

**Files Modified:**
- `react-demo-clearervoice/src/components/Dashboard.tsx` - Added CallRecorder component

**Features:**
- Record raw audio (before Speex processing)
- Record processed audio (after Speex processing)
- Side-by-side playback comparison
- Audio player controls (play, pause, stop, seek)
- Progress bar with click-to-seek
- Download all recordings (raw, processed, metadata JSON)
- Metadata tracking:
  - Duration
  - Speex enabled/disabled
  - Browser NS enabled/disabled
  - Sample rate

**How to Use:**
1. Toggle Speex ON or OFF
2. Click "Start Recording"
3. Speak into microphone (make some noise)
4. Click "Stop Recording"
5. Play back raw vs processed audio
6. Download recordings for offline comparison

**Testing Workflow:**
```
1. Enable Speex
2. Start Recording
3. Speak with background noise
4. Stop Recording
5. Play Raw Audio (hear noise)
6. Play Processed Audio (hear Speex noise suppression)
7. Compare the difference
```

### 2. Demo Switcher Improvements

**Files Modified:**
- `react-demo-clearervoice/src/components/DemoSwitcher.tsx`
- `react-demo-rnnoise/src/components/DemoSwitcher.tsx`

**Changes:**
- Removed complex multi-step terminal instructions
- Simplified to single confirm dialog
- Shows which demo directory to run
- Just click "OK" and reload page
- User manually starts the demo they want (simpler mental model)

**Old Behavior:**
```
Popup with 5 steps:
1. Stop this demo (Ctrl+C in terminal)
2. cd react-demo-xxx
3. npm install (if you haven't already)
4. npm run dev
5. Refresh this page
```

**New Behavior:**
```
Popup with simple message:
"Switching to [Demo] demo...

Note: You'll need to manually start the [Demo] demo server 
if it's not already running:

cd react-demo-xxx
npm run dev"

[Cancel] [OK]
```

**Benefits:**
- Less overwhelming for users
- Clearer mental model (you control which demo runs)
- No false expectations (browser can't start terminal commands)
- Faster to read and understand

## Architecture

### Call Recorder Flow

```
User clicks "Start Recording"
  ↓
Check if Speex is enabled
  ↓
If Speex enabled:
  - Get raw stream from Speex processor
  - Get processed stream from Speex processor
  - Record both streams separately
  ↓
If Speex disabled:
  - Get current microphone stream
  - Record same stream for both (no processing)
  ↓
User clicks "Stop Recording"
  ↓
Create Blob objects for both recordings
  ↓
Display playback controls
  ↓
User can play, pause, seek, download
```

### Audio Player Features

- **Time Display**: Shows current time / total duration
- **Progress Bar**: Visual representation of playback position
- **Click to Seek**: Click anywhere on progress bar to jump
- **Play/Pause/Stop**: Full playback controls
- **Side-by-Side**: Compare raw vs processed easily

## Testing

### Test Speex Recording

1. **Open Speex demo**: https://localhost:8443 (already running)
2. **Hard refresh**: Cmd+Shift+R
3. **Authenticate**: Login to Genesys Cloud
4. **Enable Speex**: Toggle ON
5. **Start Recording**: Click "Start Recording" button
6. **Make Noise**: Speak with background noise (music, fan, etc.)
7. **Stop Recording**: Click "Stop Recording" button
8. **Play Raw**: Click "Play Raw" - should hear noise
9. **Play Processed**: Click "Play Processed" - should hear less noise
10. **Download**: Click "Download All Recordings" to save files

### Test Demo Switcher

1. **Open Demo Switcher**: Click to expand
2. **Click Switch**: Click "Switch" on another demo
3. **See Simple Message**: No complex instructions
4. **Click OK**: Confirms you understand
5. **Page Reloads**: Browser refreshes
6. **Start Correct Demo**: Manually run the demo you want in terminal

## Files Structure

```
react-demo-clearervoice/
├── src/
│   ├── components/
│   │   ├── CallRecorder.tsx       ← NEW: Recording UI
│   │   ├── CallRecorder.css       ← NEW: Recording styles
│   │   ├── Dashboard.tsx          ← MODIFIED: Added CallRecorder
│   │   └── DemoSwitcher.tsx       ← MODIFIED: Simplified switching
│   └── utils/
│       └── audioRecorder.ts       ← NEW: Recording logic
```

## Comparison with RNNoise Demo

Both demos now have identical CallRecorder functionality:

| Feature | RNNoise Demo | Speex Demo |
|---------|--------------|------------|
| **Recording** | ✅ Raw + Processed | ✅ Raw + Processed |
| **Playback** | ✅ Side-by-side | ✅ Side-by-side |
| **Controls** | ✅ Play/Pause/Stop | ✅ Play/Pause/Stop |
| **Seek** | ✅ Click progress bar | ✅ Click progress bar |
| **Download** | ✅ 3 files | ✅ 3 files |
| **Metadata** | ✅ JSON | ✅ JSON |

## Benefits

### For Users
- Easy way to test if noise suppression is working
- Visual feedback (progress bar, time display)
- Can download recordings for offline analysis
- Side-by-side comparison makes differences obvious

### For Developers
- Reusable audio recorder utility
- Clean separation of concerns
- TypeScript types for safety
- Console logging for debugging

### For Testing
- Objective comparison (download and analyze)
- Metadata includes all relevant settings
- Can share recordings with others
- Reproducible test cases

## Next Steps

### Potential Enhancements
1. **Waveform Visualization**: Show audio waveforms
2. **dB Meter**: Real-time noise level measurement
3. **Spectogram**: Frequency analysis
4. **A/B Testing**: Quick toggle between raw/processed
5. **Auto-Record**: Start recording when call starts
6. **Cloud Upload**: Save recordings to cloud storage

### Demo Switcher Future
1. **Auto-Detection**: Detect which demo is running
2. **Port Checking**: Verify demo is available before switching
3. **One-Click Switch**: Automatically stop/start demos (requires backend)
4. **URL Parameters**: Use ?demo=speex to indicate which demo

## Status

✅ **COMPLETE** - Call Recorder added to Speex demo
✅ **COMPLETE** - Demo Switcher simplified for better UX

## How to Test Right Now

The Speex demo is already running on https://localhost:8443

1. Hard refresh browser (Cmd+Shift+R)
2. You should see the new "Call Recorder" section
3. Toggle Speex ON
4. Click "Start Recording"
5. Make some noise
6. Click "Stop Recording"
7. Play back and compare!

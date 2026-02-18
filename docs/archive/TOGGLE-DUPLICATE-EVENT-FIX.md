# Toggle Duplicate Event Fix

## Problem Summary
The GuxToggle component was firing multiple events (`check` and `click`) for a single user action, causing the handler to run multiple times. This resulted in:
- RNNoise processor being re-initialized multiple times
- Multiple microphone permission requests
- Console spam with duplicate log messages
- Processor never properly enabling/disabling because React state was stale

## Root Causes

### 1. Multiple Event Firing
The GuxToggle web component fires both `check` and `click` events when toggled, causing the handler to run twice per click.

### 2. Stale React State
The handler was checking `isEnabled` React state, which was stale during async operations. The processor would complete enabling, but the next event would still see `isEnabled=false` and try to enable again.

### 3. No Re-initialization Check
Every toggle would call `processor.initialize()` even if the processor was already initialized, causing:
- Multiple WASM module loads
- Multiple audio contexts
- Memory leaks

## Changes Made

### 1. Added Duplicate Event Prevention
**File**: `genesys-cloud-webrtc-sdk/react-demo-rnnoise/src/components/VoiceIsolation.tsx`

```typescript
const isHandlingToggle = useRef(false); // Prevent duplicate event handling

async function handleToggle() {
  // Prevent duplicate event handling (toggle fires multiple events)
  if (isHandlingToggle.current) {
    console.log('[VoiceIsolation] Already handling toggle, ignoring duplicate event');
    return;
  }
  
  isHandlingToggle.current = true;
  
  try {
    // ... handler logic ...
  } finally {
    isHandlingToggle.current = false; // Allow next toggle
  }
}
```

### 2. Check Actual Processor State Instead of React State
```typescript
// Check actual processor state, not React state (which may be stale)
const processorIsEnabled = processor.getState();
console.log('[VoiceIsolation] Processor actual state:', processorIsEnabled);

if (!processorIsEnabled) {
  // ENABLE logic
} else {
  // DISABLE logic
}
```

### 3. Added Re-initialization Check
```typescript
if (!processorIsEnabled) {
  // ENABLING RNNoise
  
  // Check if processor is already initialized
  if (processor.isReady()) {
    console.log('[VoiceIsolation] Processor already initialized, just enabling...');
    processor.enable();
    setIsEnabled(true);
    logSuccess('VOICE_ISOLATION', 'RNNoise voice isolation enabled (reusing existing processor)');
  } else {
    // Full initialization flow (mic access, WASM load, etc.)
    // ...
  }
}
```

### 4. Improved Error Handling
```typescript
} catch (error) {
  console.error('[VoiceIsolation] ERROR during toggle:', error);
  logError('VOICE_ISOLATION', 'Failed to toggle RNNoise', error);
  
  // Sync React state with actual processor state on error
  const processor = getRNNoiseProcessor();
  setIsEnabled(processor.getState());
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  alert(`Failed to ${isEnabled ? 'disable' : 'enable'} voice isolation: ${errorMessage}`);
} finally {
  setIsProcessing(false);
  isHandlingToggle.current = false; // Allow next toggle
}
```

## Expected Behavior After Fix

### When Clicking Toggle Once:
1. Handler runs ONCE (duplicate events ignored)
2. Checks actual processor state (not stale React state)
3. First time: Full initialization (mic access, WASM load, audio pipeline setup)
4. Subsequent times: Just enable/disable (reuses existing processor)
5. Console shows clean, non-duplicate logs
6. Status updates correctly to "Active" or "Inactive"

### Console Output (First Enable):
```
[VoiceIsolation] ========== TOGGLE CLICKED ==========
[VoiceIsolation] Processor actual state: false
[VoiceIsolation] ENABLING RNNoise...
[VoiceIsolation] Requesting microphone access...
[VOICE_ISOLATION] Microphone access granted
[RNNOISE] Loading RNNoise WASM module...
[RNNOISE] RNNoise WASM module loaded successfully
[RNNOISE] Creating RNNoise state object...
[RNNOISE] RNNoise state created successfully (ptr: 5340536)
[RNNOISE] RNNoise processor initialized successfully
[RNNOISE] RNNoise ENABLED - Now suppressing background noise on outbound audio
[VoiceIsolation] ========== ENABLE COMPLETE ==========
```

### Console Output (Second Enable - Reusing Processor):
```
[VoiceIsolation] ========== TOGGLE CLICKED ==========
[VoiceIsolation] Processor actual state: false
[VoiceIsolation] ENABLING RNNoise...
[VoiceIsolation] Processor already initialized, just enabling...
[RNNOISE] RNNoise ENABLED - Now suppressing background noise on outbound audio
[VoiceIsolation] ========== ENABLE COMPLETE ==========
```

### Console Output (Disable):
```
[VoiceIsolation] ========== TOGGLE CLICKED ==========
[VoiceIsolation] Processor actual state: true
[VoiceIsolation] DISABLING RNNoise...
[RNNOISE] RNNoise DISABLED - Audio passing through without processing
[RNNOISE] Destroying RNNoise state (ptr: 5340536)
[RNNOISE] RNNoise state destroyed successfully
[RNNOISE] RNNoise processor cleaned up
[VoiceIsolation] ========== DISABLE COMPLETE ==========
```

## Technical Details

### Event Flow
1. User clicks toggle
2. GuxToggle fires `check` event → handler runs
3. `isHandlingToggle.current` set to `true`
4. GuxToggle fires `click` event → handler returns early (already handling)
5. First handler completes → `isHandlingToggle.current` set to `false`
6. Ready for next toggle

### State Management
- React state (`isEnabled`): UI display only
- Processor state (`processor.getState()`): Source of truth for logic
- Ref flag (`isHandlingToggle.current`): Prevents duplicate execution

### Processor Lifecycle
1. **First enable**: Full initialization (mic + WASM + audio pipeline)
2. **Disable**: Cleanup (destroy state, close audio context)
3. **Re-enable**: Check if initialized → reuse if possible, otherwise re-initialize

## Build Status
✅ TypeScript compilation: SUCCESS (no errors)
✅ Vite build: SUCCESS
✅ Dev server: Running on port 8443

## Files Modified
- `genesys-cloud-webrtc-sdk/react-demo-rnnoise/src/components/VoiceIsolation.tsx`

## Testing Instructions
1. **Refresh the browser** to load the new build
2. Click the Voice Isolation toggle
3. Verify in console:
   - Only ONE "TOGGLE CLICKED" message per click
   - Clean, non-duplicate log messages
   - Status changes to "Active"
4. Click toggle again to disable
5. Verify clean shutdown
6. Click toggle again to re-enable
7. Verify it reuses existing processor (faster, no mic permission prompt)

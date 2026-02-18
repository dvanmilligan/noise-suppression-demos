# Switching Between Demo Apps

## Important: OAuth Configuration

All demo apps run on **port 8443** to use the same OAuth redirect URI configuration. This means you can only run one demo at a time, but you won't need to reconfigure OAuth for each demo.

## Quick Switch Methods

### Method 1: Using the Switch Script (Easiest)

```bash
./switch-demo.sh
```

This will present a menu to choose which demo to run.

### Method 2: Manual Start

Stop any running demo (Ctrl+C), then:

**Baseline Demo (No Voice Isolation)**
```bash
cd react-demo-app
npm run dev
```

**RNNoise Demo (Low Latency Noise Suppression)**
```bash
cd react-demo-rnnoise
npm run dev
```

**Speex Demo (Open-Source Noise Suppression)**
```bash
cd react-demo-clearervoice
npm install  # First time only
npm run dev
```

## Testing Workflow

1. **Start with Baseline**
   - Run the baseline demo
   - Make a test call
   - Note the audio quality with background noise

2. **Switch to RNNoise**
   - Stop baseline demo (Ctrl+C)
   - Start RNNoise demo
   - Refresh browser (https://localhost:8443/)
   - Make same test call
   - Toggle voice isolation on/off to compare

3. **Try Speex**
   - Stop RNNoise demo (Ctrl+C)
   - Start Speex demo
   - Refresh browser (https://localhost:8443/)
   - Make same test call
   - Toggle noise suppression on/off to compare

4. **Compare Results**
   - Note differences in:
     - Background noise reduction
     - Voice clarity
     - Latency
     - Overall quality

## Visual Differences

Each demo has a subtitle in the header to identify which version you're using:

- **Baseline**: "Genesys Cloud WebRTC SDK"
- **RNNoise**: "Genesys Cloud WebRTC SDK - with RNNoise Voice Isolation"
- **Speex**: "Genesys Cloud WebRTC SDK - with Speex Noise Suppression"

## Troubleshooting

### OAuth Error: "The OAuth client ID or redirect URI is invalid"

This happens if:
1. You're trying to run on a different port
2. The redirect URI isn't registered in Genesys Cloud

**Solution**: Make sure all demos use port 8443 (already configured)

### Demo Won't Start

```bash
# Clean install
cd react-demo-rnnoise  # or whichever demo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Changes Not Showing

1. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Restart the dev server

## Running Multiple Demos Simultaneously (Advanced)

If you need to run multiple demos at once for comparison, you'll need to:

1. Register additional OAuth redirect URIs in Genesys Cloud:
   - https://localhost:8444/
   - https://localhost:8445/
   - https://localhost:8446/

2. Update each demo's port in:
   - `package.json` (dev script)
   - `vite.config.ts` (server.port)

3. Start each demo in a separate terminal

**Note**: This requires admin access to your Genesys Cloud OAuth configuration.

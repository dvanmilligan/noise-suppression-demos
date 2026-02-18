# Setup Instructions for Reviewers

## Quick Setup Guide (10 Minutes)

Follow these steps to extract the package and run the demos on your machine.

### Prerequisites

Before you start, make sure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Terminal/Command Prompt** access
- **Genesys Cloud OAuth credentials** (Client ID)

Check your Node.js version:
```bash
node --version
# Should show v16.x.x or higher
```

---

## Option 1: Automated Setup (Recommended)

The easiest way to get started is using the automated install script.

### Step 1: Extract the Package (1 minute)

```bash
# Navigate to where you downloaded the file
cd ~/Downloads

# Extract the package
tar -xzf noise-suppression-demos-20260218.tar.gz

# Navigate into the extracted folder
cd genesys-cloud-webrtc-sdk
```

### Step 2: Run the Installer (5 minutes)

```bash
./install.sh
```

The script will:
1. Check that Node.js v16+ is installed
2. Install all dependencies for all demos
3. Prompt you for your OAuth Client ID
4. Prompt you for your Genesys Cloud environment
5. Create config.json files for all demos
6. Ask which demo you want to start
7. Start the selected demo automatically

### Step 3: Open in Browser (30 seconds)

The script will start the demo and display:
```
The demo will open at: https://localhost:8443
```

1. Open your web browser (Chrome, Firefox, or Edge recommended)
2. Navigate to: **https://localhost:8443**
3. You'll see a security warning (because it's a self-signed certificate)
   - **Chrome**: Click "Advanced" → "Proceed to localhost (unsafe)"
   - **Firefox**: Click "Advanced" → "Accept the Risk and Continue"
   - **Edge**: Click "Advanced" → "Continue to localhost (unsafe)"
4. The demo should load!

That's it! Skip to "Step 6: Login and Test" below.

---

## Option 2: Manual Setup

If you prefer to set up manually or the automated script doesn't work for your system:

### Step 1: Extract the Package (1 minute)

### Step 1: Extract the Package (1 minute)

### On Mac/Linux:
```bash
# Navigate to where you downloaded the file
cd ~/Downloads

# Extract the package
tar -xzf noise-suppression-demos-20260218.tar.gz

# Navigate into the extracted folder
cd genesys-cloud-webrtc-sdk
```

### On Windows:
1. Right-click on `noise-suppression-demos-20260218.tar.gz`
2. Select "Extract All..." (or use 7-Zip if installed)
3. Open Command Prompt or PowerShell
4. Navigate to the extracted folder:
```cmd
cd path\to\genesys-cloud-webrtc-sdk
```

---

## Step 2: Install Dependencies (5 minutes)

This installs all the required packages for the demos.

```bash
# Install root dependencies
npm install

# Install Baseline demo dependencies
cd react-demo-app
npm install
cd ..

# Install Speex demo dependencies
cd react-demo-clearervoice
npm install
cd ..

# Install RNNoise demo dependencies
cd react-demo-rnnoise
npm install
cd ..
```

**Note**: This will take a few minutes as it downloads all dependencies.

---

## Step 3: Configure OAuth (2 minutes)

You need to add your Genesys Cloud OAuth credentials.

### Create config.json file:

Navigate to the demo you want to run and edit the config file:

```bash
# For Speex demo (recommended)
cd react-demo-clearervoice/public
```

Create or edit `config.json`:

```json
{
  "clientId": "YOUR-OAUTH-CLIENT-ID-HERE",
  "redirectUri": "https://localhost:8443",
  "environment": "mypurecloud.com"
}
```

**Replace** `YOUR-OAUTH-CLIENT-ID-HERE` with your actual OAuth Client ID from Genesys Cloud.

**Important**: 
- The `redirectUri` MUST be `https://localhost:8443`
- Make sure your OAuth client in Genesys Cloud has this redirect URI configured

### Copy config to other demos (optional):

```bash
# From the genesys-cloud-webrtc-sdk directory
cp react-demo-clearervoice/public/config.json react-demo-app/public/
cp react-demo-clearervoice/public/config.json react-demo-rnnoise/public/
```

---

## Step 4: Run a Demo (1 minute)

### Option A: Run Speex Demo (Recommended)

```bash
cd react-demo-clearervoice
npm run dev
```

### Option B: Run Baseline Demo

```bash
cd react-demo-app
npm run dev
```

### Option C: Run RNNoise Demo

```bash
cd react-demo-rnnoise
npm run dev
```

**You should see output like:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   https://localhost:8443/
➜  Network: use --host to expose
```

---

## Step 5: Open in Browser (30 seconds)

1. Open your web browser (Chrome, Firefox, or Edge recommended)
2. Navigate to: **https://localhost:8443**
3. You'll see a security warning (because it's a self-signed certificate)
   - **Chrome**: Click "Advanced" → "Proceed to localhost (unsafe)"
   - **Firefox**: Click "Advanced" → "Accept the Risk and Continue"
   - **Edge**: Click "Advanced" → "Continue to localhost (unsafe)"
4. The demo should load!

---

## Step 6: Login and Test (2 minutes)

1. Click the **"Login"** button
2. You'll be redirected to Genesys Cloud login
3. Enter your Genesys Cloud credentials
4. Grant permissions if prompted
5. You'll be redirected back to the demo
6. You should now see the softphone interface!

### Test the Demo:

1. **Select your microphone** in the "Devices" section
2. **Enable noise suppression** (toggle the switch)
3. **Make a test call** or use the recording feature
4. **Compare audio** with and without noise suppression

---

## Switching Between Demos

To switch to a different demo:

1. **Stop the current demo**: Press `Ctrl+C` in the terminal
2. **Navigate to the new demo**:
   ```bash
   cd ../react-demo-app  # or react-demo-clearervoice, react-demo-rnnoise
   ```
3. **Start the new demo**:
   ```bash
   npm run dev
   ```
4. **Refresh your browser** at https://localhost:8443

**Or use the Demo Switcher in the UI** (it provides copy-paste commands).

---

## Troubleshooting

### Port 8443 Already in Use

If you see an error about port 8443 being in use:

**Mac/Linux:**
```bash
lsof -ti :8443 | xargs kill -9
```

**Windows:**
```cmd
netstat -ano | findstr :8443
taskkill /PID <PID_NUMBER> /F
```

### OAuth Redirect Error

If you get an OAuth redirect error:
1. Check that `config.json` has the correct `clientId`
2. Verify the redirect URI in Genesys Cloud matches `https://localhost:8443`
3. Make sure you're accessing the demo at `https://localhost:8443` (not http)

### Dependencies Installation Failed

If `npm install` fails:
1. Make sure you have Node.js v16 or higher
2. Try clearing npm cache: `npm cache clean --force`
3. Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### Browser Shows "Not Secure"

This is normal for localhost development. The demos use a self-signed certificate. Just proceed past the warning.

### Microphone Not Working

1. Check browser permissions (allow microphone access)
2. Make sure your microphone is selected in the "Devices" section
3. Try refreshing the page
4. Check browser console for errors (F12)

---

## What to Review

Once you have the demos running, here's what to focus on:

### 1. Test Each Demo (30 minutes)
- Baseline Demo (browser native)
- Speex Demo (open-source)
- RNNoise Demo (AI-based, has known issues)

### 2. Review Key Files (1 hour)
- `react-demo-clearervoice/src/utils/speexProcessor.ts`
- `react-demo-rnnoise/src/utils/rnnoiseProcessor.ts`
- `src/components/DemoSwitcher.tsx`

### 3. Check Documentation (30 minutes)
- `PACKAGE-FOR-REVIEW.md` - Quick overview
- `NOISE-SUPPRESSION-DEMOS-README.md` - Complete guide
- `DEVELOPER-GUIDE.md` - Technical details

### 4. Test Features
- [ ] Demo switcher (collapsible UI)
- [ ] Noise suppression toggle
- [ ] Audio recording and comparison
- [ ] Advanced microphone settings
- [ ] Device selection
- [ ] Making/receiving calls

---

## Getting Help

If you run into issues:

1. **Check the documentation**:
   - `PACKAGE-FOR-REVIEW.md`
   - `NOISE-SUPPRESSION-DEMOS-README.md`
   - `DEVELOPER-GUIDE.md`

2. **Check the browser console** (F12) for error messages

3. **Known Issues**:
   - RNNoise VAD always shows 0.000 (documented issue)
   - Safari has limited AudioWorklet support
   - Only one demo can run at a time (port 8443)

---

## Quick Command Reference

```bash
# Extract package
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# Install all dependencies
npm install
cd react-demo-clearervoice && npm install && cd ..

# Configure OAuth
nano react-demo-clearervoice/public/config.json

# Run demo
cd react-demo-clearervoice
npm run dev

# Open browser
# https://localhost:8443

# Stop demo
# Press Ctrl+C

# Kill process on port 8443 (if needed)
lsof -ti :8443 | xargs kill -9
```

---

## System Requirements

- **Operating System**: macOS, Linux, or Windows
- **Node.js**: v16 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Browser**: Chrome, Firefox, or Edge (latest version)
- **Internet**: Required for OAuth and Genesys Cloud connection
- **Microphone**: Required for testing audio features

---

## Next Steps

After you have the demos running:

1. Read `DEVELOPER-GUIDE.md` for technical details
2. Review the source code in key files
3. Test all three demos
4. Provide feedback on architecture, code quality, and improvements

---

**Need Help?** Check the documentation files or create an issue in the repository.

**Ready to Review?** Start with `PACKAGE-FOR-REVIEW.md` for a complete review checklist.

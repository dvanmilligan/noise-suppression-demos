# Demo Launcher Utilities

Three easy ways to launch and switch between WebRTC demos without memorizing terminal commands.

## 🎯 Quick Start

### Option 1: Bash Script (Recommended for Mac/Linux)

The simplest way to launch demos:

```bash
cd genesys-cloud-webrtc-sdk
./launch-demo.sh
```

**Features:**
- Interactive menu to choose demos
- Automatic dependency installation
- Port conflict detection
- Color-coded output
- One command to rule them all

**Quick Launch (skip menu):**
```bash
./launch-demo.sh 1  # Launch Baseline Demo
./launch-demo.sh 2  # Launch Speex Demo
./launch-demo.sh 3  # Launch RNNoise Demo
```

### Option 2: HTML Launcher (Visual Interface)

Open the HTML file in your browser for a visual interface:

```bash
open genesys-cloud-webrtc-sdk/demo-launcher.html
```

**Features:**
- Beautiful visual interface
- Click to copy terminal commands
- Demo descriptions and instructions
- No terminal knowledge required

### Option 3: Node.js Launcher (Advanced)

For users who want a persistent launcher with start/stop controls:

```bash
cd genesys-cloud-webrtc-sdk
node demo-launcher.js
```

**Features:**
- Start/stop demos from one interface
- Restart current demo
- Process management
- Real-time status

## 📋 Demo Information

### 1. Baseline Demo (react-demo-app)
- **Port:** 8443
- **Description:** Standard WebRTC with browser's built-in noise suppression
- **Use Case:** Reference implementation, testing browser capabilities

### 2. Speex Demo (react-demo-clearervoice)
- **Port:** 8443
- **Description:** Open-source Speex noise suppression
- **Use Case:** Production-ready noise suppression, zero latency
- **Features:** 
  - Browser-based processing
  - Stereo audio support
  - Real-time noise reduction
  - No backend required

### 3. RNNoise Demo (react-demo-rnnoise)
- **Port:** 8443
- **Description:** AI-based RNNoise noise suppression
- **Use Case:** Experimental AI noise reduction
- **Note:** VAD (Voice Activity Detection) has known issues

## 🔧 Manual Launch Commands

If you prefer to run commands directly:

```bash
# Baseline Demo
cd genesys-cloud-webrtc-sdk/react-demo-app && npm run dev

# Speex Demo
cd genesys-cloud-webrtc-sdk/react-demo-clearervoice && npm run dev

# RNNoise Demo
cd genesys-cloud-webrtc-sdk/react-demo-rnnoise && npm run dev
```

## ⚠️ Important Notes

### Port Conflicts
All demos run on port **8443** for OAuth compatibility. Only one demo can run at a time.

**To stop a running demo:**
- Press `Ctrl+C` in the terminal where it's running

**To check if port is in use:**
```bash
lsof -i :8443
```

**To kill process on port 8443:**
```bash
lsof -ti :8443 | xargs kill -9
```

### First Time Setup
Each demo will automatically install dependencies on first launch. This may take a few minutes.

### Browser Access
After starting a demo, open:
```
https://localhost:8443
```

**Note:** You may see a security warning because of the self-signed certificate. This is normal for local development. Click "Advanced" and "Proceed to localhost".

## 🐛 Troubleshooting

### "Port already in use"
Another demo (or process) is using port 8443. Stop it first:
```bash
# Find the process
lsof -i :8443

# Kill it
lsof -ti :8443 | xargs kill -9
```

### "Command not found: npm"
Install Node.js and npm:
```bash
# Mac (using Homebrew)
brew install node

# Or download from: https://nodejs.org/
```

### "Permission denied: ./launch-demo.sh"
Make the script executable:
```bash
chmod +x genesys-cloud-webrtc-sdk/launch-demo.sh
```

### Demo won't start
1. Make sure you're in the correct directory
2. Try deleting `node_modules` and reinstalling:
   ```bash
   cd react-demo-app  # or react-demo-clearervoice or react-demo-rnnoise
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

## 📊 Comparison

| Feature | Bash Script | HTML Launcher | Node.js Launcher |
|---------|-------------|---------------|------------------|
| Interactive Menu | ✅ | ✅ | ✅ |
| Visual Interface | ❌ | ✅ | ❌ |
| Start/Stop Control | ❌ | ❌ | ✅ |
| Port Detection | ✅ | ❌ | ✅ |
| Copy Commands | ❌ | ✅ | ❌ |
| Process Management | ❌ | ❌ | ✅ |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🎓 Recommended Workflow

1. **First Time:** Use HTML Launcher to understand the demos
2. **Daily Use:** Use Bash Script for quick launches
3. **Development:** Use Node.js Launcher for frequent switching

## 💡 Tips

- Keep the launcher terminal open while using demos
- Use browser's hard refresh (Cmd+Shift+R) after switching demos
- Check browser console for detailed logs
- Use AdvancedMicSettings to optimize audio for each demo

## 🔗 Related Documentation

- [Speex Integration](./SPEEX-INTEGRATION-COMPLETE.md)
- [RNNoise Features](./RNNOISE-DEMO-FEATURES.md)
- [Demo Consistency](./DEMO-CONSISTENCY-COMPLETE.md)
- [Advanced Mic Settings](./ADVANCED-MIC-SETTINGS-INTEGRATION.md)

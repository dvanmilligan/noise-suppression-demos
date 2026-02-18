# ClearerVoice Integration Demo

✅ **IMPLEMENTATION COMPLETE**

This demo integrates ClearerVoice-Studio advanced voice isolation with the Genesys Cloud WebRTC SDK.

## 🎯 What's Included

- ✅ Python FastAPI backend server
- ✅ React frontend component with audio comparison
- ✅ 3 AI models (MossFormer2, FRCRN, MossFormerGAN)
- ✅ File upload & processing
- ✅ Progress tracking
- ✅ Side-by-side audio playback
- ✅ Complete documentation & setup scripts

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Backend:**
```bash
cd backend
./start.sh  # macOS/Linux
# or
start.bat   # Windows
```

**Frontend:**
```bash
npm install
npm run dev
```

### Option 2: Manual Setup

See [SETUP.md](./SETUP.md) for detailed instructions.

## 📋 Architecture

```
Browser (React) → Python Backend (FastAPI) → ClearerVoice Models → Enhanced Audio
```

### Components

1. **React Frontend** (`/src/components`)
   - `ClearerVoiceEnhancer.tsx` - Main UI component
   - File upload, model selection, progress tracking
   - Side-by-side audio comparison player

2. **Python Backend** (`/backend`)
   - `server.py` - FastAPI application
   - Audio processing with ClearerVoice
   - Job queue & status tracking
   - RESTful API + WebSocket

3. **AI Models** (auto-downloaded)
   - MossFormer2_SE_48K (48kHz, PESQ: 3.16)
   - FRCRN_SE_16K (16kHz, PESQ: 3.23)
   - MossFormerGAN_SE_16K (16kHz, PESQ: 3.47)

## 🎨 Features

- **Speech Enhancement**: Remove background noise, improve clarity
- **Multiple Models**: Choose optimal model for your audio
- **Progress Tracking**: Real-time processing status
- **Audio Comparison**: Side-by-side playback (original vs enhanced)
- **Download**: Save enhanced audio as WAV
- **Error Handling**: Clear error messages
- **Responsive UI**: Works on desktop and mobile

## 📡 API Endpoints

- `GET /` - Health check
- `GET /api/models` - List available models
- `POST /api/enhance` - Upload & enhance audio
- `GET /api/status/{job_id}` - Check processing status
- `GET /api/download/{job_id}` - Download enhanced audio
- `DELETE /api/cleanup/{job_id}` - Clean up job files
- `WS /ws/progress` - Real-time progress updates

## 🎵 Available Models

| Model | Sample Rate | PESQ | STOI | Best For |
|-------|-------------|------|------|----------|
| **MossFormer2_SE_48K** | 48kHz | 3.16 | 0.95 | High-quality recordings |
| **FRCRN_SE_16K** | 16kHz | 3.23 | 0.95 | Fast processing |
| **MossFormerGAN_SE_16K** | 16kHz | 3.47 | 0.96 | Best 16kHz quality |

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [backend/README.md](./backend/README.md) - Backend API documentation
- [API Docs](http://localhost:8000/docs) - Interactive Swagger UI (when server running)

## ⚡ Performance

- **Processing Time**: 2-5 seconds for 10-second audio
- **Model Download**: ~500MB on first run (cached after)
- **Memory Usage**: ~2GB during processing
- **Supported Formats**: WAV, MP3, M4A, FLAC, OGG, etc.

## 🔧 Troubleshooting

### Backend won't start
```bash
# Make sure Python 3.8+ is installed
python3 --version

# Activate virtual environment
source backend/venv/bin/activate  # macOS/Linux
backend\venv\Scripts\activate     # Windows

# Install dependencies
pip install -r backend/requirements.txt
```

### Frontend can't connect
- Ensure backend is running on port 8000
- Check CORS settings in `backend/server.py`
- Visit http://localhost:8000 to verify backend

### Models downloading slowly
- First run downloads ~500MB from HuggingFace
- Be patient, subsequent runs are instant
- Models cached in `~/.cache/huggingface/`

## 🆚 Comparison with RNNoise

| Feature | RNNoise | ClearerVoice |
|---------|---------|--------------|
| Processing | Real-time (browser) | Async (2-5s backend) |
| Quality | Limited (VAD issues) | Excellent (SOTA AI) |
| Setup | Simple | Moderate |
| Use Case | Live calls | Post-processing |

## 🎯 Use Cases

**Ideal For:**
- Post-call audio enhancement
- Podcast/recording cleanup
- Batch processing
- Quality comparison testing

**Not Ideal For:**
- Real-time live calls (use browser NS)
- Low-latency requirements

## 📦 Project Structure

```
react-demo-clearervoice/
├── backend/
│   ├── server.py              # FastAPI server
│   ├── requirements.txt       # Python deps
│   ├── start.sh / start.bat   # Startup scripts
│   └── README.md              # Backend docs
├── src/
│   └── components/
│       ├── ClearerVoiceEnhancer.tsx
│       └── ClearerVoiceEnhancer.css
├── SETUP.md                   # Setup guide
├── IMPLEMENTATION_SUMMARY.md  # Technical details
└── README.md                  # This file
```

## 🔗 Resources

- [ClearerVoice GitHub](https://github.com/modelscope/ClearerVoice-Studio)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [HuggingFace Models](https://huggingface.co/alibabasglab)

## ✅ Status

**Implementation: COMPLETE**

All components are built and ready to use. Follow the Quick Start guide above to get started!

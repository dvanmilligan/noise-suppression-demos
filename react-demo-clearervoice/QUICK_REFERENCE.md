# ClearerVoice Quick Reference

## 🚀 Start Everything

```bash
# Terminal 1: Backend
cd backend && ./start.sh

# Terminal 2: Frontend  
npm run dev
```

## 📍 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🎵 Models

| Model | Rate | Quality | Speed |
|-------|------|---------|-------|
| MossFormer2_SE_48K | 48kHz | ⭐⭐⭐ | Medium |
| FRCRN_SE_16K | 16kHz | ⭐⭐ | Fast |
| MossFormerGAN_SE_16K | 16kHz | ⭐⭐⭐⭐ | Medium |

## 📡 API Cheat Sheet

```bash
# List models
curl http://localhost:8000/api/models

# Enhance audio
curl -X POST http://localhost:8000/api/enhance \
  -F "file=@audio.wav" \
  -F "model_name=MossFormer2_SE_48K"

# Check status
curl http://localhost:8000/api/status/{job_id}

# Download result
curl http://localhost:8000/api/download/{job_id} -o enhanced.wav

# Cleanup
curl -X DELETE http://localhost:8000/api/cleanup/{job_id}
```

## 🐛 Common Issues

### Backend won't start
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

### Frontend can't connect
- Check backend is running: `curl http://localhost:8000`
- Check CORS in `backend/server.py`

### Models not downloading
- Check internet connection
- Check HuggingFace access
- Wait 2-5 minutes on first run

## 📂 File Locations

```
backend/
├── uploads/     # Temporary uploads
├── outputs/     # Enhanced audio
└── venv/        # Python environment

~/.cache/huggingface/  # Downloaded models
```

## ⚡ Performance

- 10s audio → 2-5s processing
- 30s audio → 5-15s processing
- 60s audio → 10-30s processing

## 🔧 Configuration

### Change Backend Port
Edit `backend/server.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=YOUR_PORT)
```

### Change Frontend API URL
Edit `src/components/ClearerVoiceEnhancer.tsx`:
```typescript
const API_BASE = 'http://localhost:YOUR_PORT';
```

## 📚 Documentation

- [README.md](./README.md) - Overview
- [SETUP.md](./SETUP.md) - Detailed setup
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [backend/README.md](./backend/README.md) - API docs

## 🆘 Help

1. Check logs in terminal
2. Visit http://localhost:8000/docs for API testing
3. Check browser console for frontend errors
4. Review documentation files above

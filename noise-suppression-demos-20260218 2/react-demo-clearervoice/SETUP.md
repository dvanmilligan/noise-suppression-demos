# ClearerVoice Integration Setup Guide

This guide will help you set up the ClearerVoice integration for advanced voice isolation.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Step 1: Backend Setup

### 1.1 Create Python Virtual Environment

```bash
cd genesys-cloud-webrtc-sdk/react-demo-clearervoice/backend
python3 -m venv venv
```

### 1.2 Activate Virtual Environment

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 1.3 Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- ClearerVoice (AI models)
- Supporting libraries

**Note:** The first time you run the server, ClearerVoice will automatically download the AI models from HuggingFace. This may take a few minutes depending on your internet connection.

### 1.4 Start the Backend Server

```bash
python server.py
```

You should see:
```
Starting ClearerVoice Backend Server...
Server will run on http://localhost:8000
API docs available at http://localhost:8000/docs
```

The server is now running and ready to process audio!

## Step 2: Frontend Setup

### 2.1 Install Node Dependencies

Open a new terminal (keep the backend running) and navigate to the frontend:

```bash
cd genesys-cloud-webrtc-sdk/react-demo-clearervoice
npm install
```

### 2.2 Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 3: Test the Integration

1. Open your browser to `http://localhost:5173`
2. Authenticate with Genesys Cloud
3. You should see the "ClearerVoice Audio Enhancement" section
4. Upload an audio file or record audio
5. Click "Enhance Audio"
6. Compare the original vs enhanced audio

## Available Models

### MossFormer2_SE_48K (Default)
- **Sample Rate:** 48kHz
- **Best For:** High-quality recordings
- **PESQ Score:** 3.16
- **STOI Score:** 0.95
- **Use Case:** Professional audio, podcasts, high-fidelity recordings

### FRCRN_SE_16K
- **Sample Rate:** 16kHz
- **Best For:** Fast processing
- **PESQ Score:** 3.23
- **STOI Score:** 0.95
- **Use Case:** Real-time applications, phone calls

### MossFormerGAN_SE_16K
- **Sample Rate:** 16kHz
- **Best For:** Best quality at 16kHz
- **PESQ Score:** 3.47
- **STOI Score:** 0.96
- **Use Case:** Voice calls, video conferencing

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'clearvoice'`
**Solution:** Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

**Problem:** Models downloading slowly
**Solution:** The first run downloads ~500MB of AI models. Be patient. Subsequent runs will be instant.

**Problem:** Port 8000 already in use
**Solution:** Change the port in `server.py` (line at the bottom: `uvicorn.run(app, host="0.0.0.0", port=8000)`)

### Frontend Issues

**Problem:** CORS errors in browser console
**Solution:** Make sure the backend is running on port 8000 and the frontend on port 5173

**Problem:** "Failed to fetch" errors
**Solution:** Check that the backend server is running. Visit `http://localhost:8000` to verify.

**Problem:** Audio upload fails
**Solution:** Check the backend terminal for error messages. Ensure the audio file format is supported (WAV, MP3, etc.)

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

### Key Endpoints

- `GET /api/models` - List available models
- `POST /api/enhance` - Upload and enhance audio
- `GET /api/status/{job_id}` - Check processing status
- `GET /api/download/{job_id}` - Download enhanced audio
- `DELETE /api/cleanup/{job_id}` - Clean up job files

## Performance Tips

1. **Use appropriate model for your audio:**
   - 48kHz audio → MossFormer2_SE_48K
   - 16kHz audio → FRCRN_SE_16K or MossFormerGAN_SE_16K

2. **Processing time:**
   - Typical: 2-5 seconds for 10-second audio clip
   - Depends on: audio length, model, CPU/GPU

3. **Memory usage:**
   - Models use ~500MB-1GB RAM each
   - First model load takes longer
   - Subsequent requests are faster (models cached)

## Next Steps

- Integrate with call recording
- Add batch processing UI
- Display quality metrics (PESQ, STOI)
- Add real-time WebSocket progress updates
- Support multiple file uploads

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  FastAPI Server │
│  (Port 8000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ClearerVoice   │
│  AI Models      │
│  (HuggingFace)  │
└─────────────────┘
```

## Resources

- [ClearerVoice GitHub](https://github.com/modelscope/ClearerVoice-Studio)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [HuggingFace Models](https://huggingface.co/alibabasglab)

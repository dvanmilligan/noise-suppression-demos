# Genesys Cloud WebRTC - Noise Suppression Demos (Hosted Version)

## Overview

This is a pre-built, ready-to-host version of the noise suppression demos. No Node.js or npm installation required!

## What's Included

- **baseline/** - Baseline Demo (Browser Native NS)
- **speex/** - Speex Demo (Open-source NS)
- **rnnoise/** - RNNoise Demo (AI-based NS)
- **index.html** - Demo selection page

## Deployment Options

### Option 1: Static Web Server

Upload the entire folder to any static web hosting service:

- **Netlify**: Drag and drop this folder
- **Vercel**: Deploy with `vercel deploy`
- **AWS S3**: Upload to S3 bucket with static hosting
- **GitHub Pages**: Push to gh-pages branch
- **Azure Static Web Apps**: Deploy via Azure portal
- **Firebase Hosting**: Use `firebase deploy`

### Option 2: Local Testing

You can test locally with any static server:

**Python:**
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
# Open http://localhost:8000
```

**PHP:**
```bash
php -S localhost:8000
# Open http://localhost:8000
```

### Option 3: Docker

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t noise-suppression-demos .
docker run -p 8080:80 noise-suppression-demos
```

## OAuth Configuration

Before deploying, you need to configure OAuth for each demo:

### 1. Create OAuth Client in Genesys Cloud

1. Log into Genesys Cloud
2. Go to Admin > Integrations > OAuth
3. Click "Add Client"
4. Select "Token Implicit Grant (Browser)"
5. Add your deployment URL as the redirect URI (e.g., `https://yourdomain.com/baseline/`)
6. Save and copy the Client ID

### 2. Update Config Files

Edit the config.json file in each demo folder:

**baseline/config.json:**
```json
{
  "clientId": "YOUR-OAUTH-CLIENT-ID",
  "redirectUri": "https://yourdomain.com/baseline/",
  "environment": "mypurecloud.com"
}
```

**speex/config.json:**
```json
{
  "clientId": "YOUR-OAUTH-CLIENT-ID",
  "redirectUri": "https://yourdomain.com/speex/",
  "environment": "mypurecloud.com"
}
```

**rnnoise/config.json:**
```json
{
  "clientId": "YOUR-OAUTH-CLIENT-ID",
  "redirectUri": "https://yourdomain.com/rnnoise/",
  "environment": "mypurecloud.com"
}
```

**Important**: The `redirectUri` must exactly match your deployment URL!

## File Structure

```
noise-suppression-demos-hosted/
├── index.html              # Demo selection page
├── README.md               # This file
├── baseline/               # Baseline demo
│   ├── index.html
│   ├── config.json         # ← Configure OAuth here
│   └── assets/
├── speex/                  # Speex demo
│   ├── index.html
│   ├── config.json         # ← Configure OAuth here
│   └── assets/
└── rnnoise/                # RNNoise demo
    ├── index.html
    ├── config.json         # ← Configure OAuth here
    └── assets/
```

## Browser Requirements

- Chrome 90+ (recommended)
- Firefox 88+
- Edge 90+
- Safari 14+ (limited support)

## HTTPS Requirement

These demos require HTTPS for:
- OAuth authentication
- Microphone access
- WebRTC functionality

Most hosting services provide HTTPS automatically. For local testing, you can use:
- `localhost` (browsers allow HTTP for localhost)
- Self-signed certificates
- ngrok or similar tunneling services

## Troubleshooting

### OAuth Redirect Error

**Problem**: "Invalid redirect URI" error

**Solution**:
1. Check that `redirectUri` in config.json matches your deployment URL exactly
2. Verify the OAuth client in Genesys Cloud has the correct redirect URI
3. Ensure you're using HTTPS (or localhost for testing)

### Microphone Not Working

**Problem**: Can't access microphone

**Solution**:
1. Ensure you're using HTTPS
2. Check browser permissions
3. Try a different browser

### Demo Won't Load

**Problem**: Blank page or errors

**Solution**:
1. Check browser console for errors (F12)
2. Verify config.json exists and is valid JSON
3. Clear browser cache and reload

## Features

### Baseline Demo
- Browser's built-in noise suppression
- Reference implementation
- Full softphone functionality

### Speex Demo
- Open-source Speex noise suppression
- Real-time audio visualization
- Side-by-side audio comparison
- Configurable settings

### RNNoise Demo
- AI-based noise suppression
- VAD (Voice Activity Detection) metrics
- Experimental features
- Known limitation: VAD always shows 0.000

## Support

For issues or questions:
- Check the browser console (F12) for errors
- Review the OAuth configuration
- Consult Genesys Cloud documentation

## License

See LICENSE file in the source repository.

---

**Ready to Deploy?**

1. Configure OAuth in each demo's config.json
2. Upload to your hosting service
3. Open in browser and test!

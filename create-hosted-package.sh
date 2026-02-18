#!/bin/bash

# Create Hosted Deployment Package
# This creates a pre-built package that can be hosted without Node.js installation

set -e

echo "📦 Creating hosted deployment package..."
echo ""

# Build all demos if not already built
echo "🔨 Building demos..."
echo ""

echo "Building Baseline demo..."
cd react-demo-app
npm run build --silent
cd ..

echo "Building Speex demo..."
cd react-demo-clearervoice
npm run build --silent
cd ..

echo "Building RNNoise demo..."
cd react-demo-rnnoise
npm run build --silent
cd ..

echo "✅ All demos built"
echo ""

# Create deployment directory
echo "📁 Creating deployment structure..."
DEPLOY_DIR="noise-suppression-demos-hosted"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy built files
cp -r react-demo-app/dist "$DEPLOY_DIR/baseline"
cp -r react-demo-clearervoice/dist "$DEPLOY_DIR/speex"
cp -r react-demo-rnnoise/dist "$DEPLOY_DIR/rnnoise"

# Create index page for demo selection
cat > "$DEPLOY_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Genesys Cloud WebRTC - Noise Suppression Demos</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      width: 100%;
    }
    
    .header {
      text-align: center;
      color: white;
      margin-bottom: 40px;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .demo-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .demo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    
    .demo-card.coming-soon {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .demo-card.coming-soon:hover {
      transform: none;
    }
    
    .demo-icon {
      font-size: 3rem;
      margin-bottom: 15px;
      display: block;
    }
    
    .demo-card h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #333;
    }
    
    .demo-card p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    
    .demo-features {
      list-style: none;
      margin-bottom: 15px;
    }
    
    .demo-features li {
      color: #555;
      padding: 5px 0;
      font-size: 0.9rem;
    }
    
    .demo-features li:before {
      content: "✓ ";
      color: #667eea;
      font-weight: bold;
      margin-right: 8px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .badge-ready {
      background: #10b981;
      color: white;
    }
    
    .badge-experimental {
      background: #f59e0b;
      color: white;
    }
    
    .badge-soon {
      background: #6b7280;
      color: white;
    }
    
    .footer {
      text-align: center;
      color: white;
      opacity: 0.8;
    }
    
    .footer a {
      color: white;
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 2rem;
      }
      
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎙️ Noise Suppression Demos</h1>
      <p>Compare different noise suppression technologies for Genesys Cloud WebRTC</p>
    </div>
    
    <div class="demo-grid">
      <a href="baseline/" class="demo-card">
        <span class="demo-icon">📱</span>
        <h2>Baseline Demo</h2>
        <span class="badge badge-ready">Production Ready</span>
        <p>Standard WebRTC with browser's built-in noise suppression. Reference implementation.</p>
        <ul class="demo-features">
          <li>Standard WebRTC</li>
          <li>Browser noise suppression</li>
          <li>Full softphone functionality</li>
        </ul>
      </a>
      
      <a href="speex/" class="demo-card">
        <span class="demo-icon">🎯</span>
        <h2>Speex Demo</h2>
        <span class="badge badge-ready">Production Ready</span>
        <p>Open-source Speex noise suppression running entirely in browser with zero latency.</p>
        <ul class="demo-features">
          <li>Real-time processing</li>
          <li>Open-source (BSD)</li>
          <li>Audio visualization</li>
        </ul>
      </a>
      
      <a href="rnnoise/" class="demo-card">
        <span class="demo-icon">🤖</span>
        <h2>RNNoise Demo</h2>
        <span class="badge badge-experimental">Experimental</span>
        <p>AI-based RNNoise for advanced noise suppression. Experimental feature with known limitations.</p>
        <ul class="demo-features">
          <li>AI-based processing</li>
          <li>Advanced algorithms</li>
          <li>VAD metrics</li>
        </ul>
      </a>
      
      <div class="demo-card coming-soon">
        <span class="demo-icon">🔬</span>
        <h2>DeepFilterNet Demo</h2>
        <span class="badge badge-soon">Coming Soon</span>
        <p>State-of-the-art deep learning noise suppression. Currently under development.</p>
        <ul class="demo-features">
          <li>Deep learning</li>
          <li>State-of-the-art quality</li>
          <li>Full-band 48kHz</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p>Powered by Genesys Cloud WebRTC SDK</p>
      <p><a href="https://developer.genesys.cloud/" target="_blank">Developer Documentation</a></p>
    </div>
  </div>
</body>
</html>
EOF

echo "✅ Deployment structure created"
echo ""

# Create deployment README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
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
EOF

echo "✅ README created"
echo ""

# Create a tarball
PACKAGE_NAME="noise-suppression-demos-hosted-$(date +%Y%m%d).tar.gz"
tar -czf "$PACKAGE_NAME" "$DEPLOY_DIR"

echo "✅ Package created: $PACKAGE_NAME"
echo ""

# Calculate size
SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
echo "📊 Package size: $SIZE"
echo ""

# Show structure
echo "📋 Package structure:"
tree -L 2 "$DEPLOY_DIR" 2>/dev/null || find "$DEPLOY_DIR" -maxdepth 2 -type d
echo ""

echo "✅ Hosted deployment package ready!"
echo ""
echo "📦 Package: $PACKAGE_NAME"
echo "📁 Directory: $DEPLOY_DIR/"
echo "📊 Size: $SIZE"
echo ""
echo "🚀 Next steps:"
echo "   1. Extract: tar -xzf $PACKAGE_NAME"
echo "   2. Configure OAuth in each demo's config.json"
echo "   3. Deploy to your hosting service"
echo "   4. Open in browser!"
echo ""
echo "💡 Quick test locally:"
echo "   cd $DEPLOY_DIR"
echo "   python3 -m http.server 8000"
echo "   Open http://localhost:8000"
echo ""


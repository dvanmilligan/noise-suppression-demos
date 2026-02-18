# Hosted Deployment Guide - No Installation Required

## Overview

This guide explains how to create and deploy a pre-built version of the noise suppression demos that requires NO Node.js or npm installation. Users can simply open the demos in a web browser.

## What's the Difference?

### Development Package (Current)
- Requires Node.js and npm
- Users run `npm install` and `npm run dev`
- Source code included
- Can modify and rebuild
- Good for developers

### Hosted Package (New)
- NO Node.js or npm required
- Pre-built HTML/CSS/JS files
- Just upload to any web server
- Users open in browser
- Good for non-technical users and demos

## Creating the Hosted Package

### Step 1: Build the Package

```bash
cd genesys-cloud-webrtc-sdk
./create-hosted-package.sh
```

This script will:
1. Build all three demos (Baseline, Speex, RNNoise)
2. Create a deployment directory with pre-built files
3. Generate an index page for demo selection
4. Create a README with deployment instructions
5. Package everything into a tarball

### Step 2: Extract the Package

```bash
tar -xzf noise-suppression-demos-hosted-20260218.tar.gz
cd noise-suppression-demos-hosted
```

### Step 3: Configure OAuth

Before deploying, you need to configure OAuth for each demo.

#### Create OAuth Client in Genesys Cloud

1. Log into Genesys Cloud
2. Go to Admin > Integrations > OAuth
3. Click "Add Client"
4. Select "Token Implicit Grant (Browser)"
5. Add your deployment URLs as redirect URIs:
   - `https://yourdomain.com/baseline/`
   - `https://yourdomain.com/speex/`
   - `https://yourdomain.com/rnnoise/`
6. Save and copy the Client ID

#### Update Config Files

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

**IMPORTANT**: The `redirectUri` must exactly match your deployment URL!

## Deployment Options

### Option 1: Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `noise-suppression-demos-hosted` folder
3. Netlify will give you a URL like `https://your-site.netlify.app`
4. Update config.json files with the Netlify URL
5. Re-upload the folder

### Option 2: Vercel

```bash
cd noise-suppression-demos-hosted
npx vercel deploy
```

Follow the prompts, then update config.json files with the Vercel URL.

### Option 3: GitHub Pages

1. Create a new repository
2. Push the `noise-suppression-demos-hosted` folder contents
3. Go to Settings > Pages
4. Select branch and save
5. Update config.json files with the GitHub Pages URL

### Option 4: AWS S3 + CloudFront

```bash
# Create S3 bucket
aws s3 mb s3://noise-suppression-demos

# Upload files
aws s3 sync noise-suppression-demos-hosted/ s3://noise-suppression-demos/ --acl public-read

# Enable static website hosting
aws s3 website s3://noise-suppression-demos/ --index-document index.html
```

Then set up CloudFront for HTTPS.

### Option 5: Azure Static Web Apps

1. Go to Azure Portal
2. Create a new Static Web App
3. Upload the `noise-suppression-demos-hosted` folder
4. Azure will provide a URL
5. Update config.json files with the Azure URL

### Option 6: Firebase Hosting

```bash
cd noise-suppression-demos-hosted
firebase init hosting
firebase deploy
```

### Option 7: Your Own Server

Upload to any web server (Apache, Nginx, IIS) and serve as static files.

## Local Testing

Before deploying, test locally:

### Python (Easiest)

```bash
cd noise-suppression-demos-hosted
python3 -m http.server 8000
```

Open http://localhost:8000

### Node.js

```bash
cd noise-suppression-demos-hosted
npx http-server -p 8000
```

Open http://localhost:8000

### PHP

```bash
cd noise-suppression-demos-hosted
php -S localhost:8000
```

Open http://localhost:8000

## File Structure

```
noise-suppression-demos-hosted/
├── index.html              # Demo selection page
├── README.md               # Deployment instructions
├── baseline/               # Baseline demo
│   ├── index.html
│   ├── config.json         # ← Configure OAuth here
│   └── assets/
│       ├── index-*.js      # Bundled JavaScript
│       └── index-*.css     # Bundled CSS
├── speex/                  # Speex demo
│   ├── index.html
│   ├── config.json         # ← Configure OAuth here
│   └── assets/
│       ├── index-*.js
│       └── index-*.css
└── rnnoise/                # RNNoise demo
    ├── index.html
    ├── config.json         # ← Configure OAuth here
    └── assets/
        ├── index-*.js
        └── index-*.css
```

## Important Notes

### HTTPS Requirement

These demos MUST be served over HTTPS for:
- OAuth authentication
- Microphone access
- WebRTC functionality

Most hosting services provide HTTPS automatically. For local testing:
- `localhost` works with HTTP (browsers allow it)
- Use ngrok for HTTPS tunneling: `ngrok http 8000`

### OAuth Redirect URI

The `redirectUri` in config.json MUST exactly match your deployment URL:
- ✅ `https://yourdomain.com/baseline/`
- ❌ `https://yourdomain.com/baseline` (missing trailing slash)
- ❌ `http://yourdomain.com/baseline/` (http instead of https)

### Demo Switcher

The demo switcher in the UI won't work in the hosted version because it tries to run terminal commands. Users should use the index page to switch between demos.

## Advantages of Hosted Deployment

1. **No Installation**: Users just open a URL
2. **Cross-Platform**: Works on any device with a browser
3. **Easy Sharing**: Send a link, no setup required
4. **Fast Loading**: Pre-built and optimized
5. **CDN Compatible**: Can be served from CDN for global performance

## Disadvantages

1. **Can't Modify Code**: Users can't change the source
2. **Fixed OAuth**: Need to reconfigure for different environments
3. **No Dev Tools**: Can't use hot reload or debugging tools
4. **Larger Package**: Includes all bundled dependencies (~4.3 MB)

## Use Cases

### When to Use Hosted Deployment

- Demos for non-technical users
- Sales presentations
- Quick testing without setup
- Sharing with stakeholders
- Production deployments

### When to Use Development Package

- Code review by developers
- Active development
- Testing code changes
- Learning the codebase
- Contributing to the project

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
4. Check that all files were uploaded correctly

### CORS Errors

**Problem**: CORS errors in console

**Solution**:
1. Ensure all files are served from the same domain
2. Check server CORS configuration
3. Verify OAuth client allows your domain

## Package Size

The hosted package is approximately 4.3 MB compressed, which includes:
- All three demos (Baseline, Speex, RNNoise)
- Bundled JavaScript and CSS
- Genesys Spark components
- WebRTC SDK
- Noise suppression libraries

This is reasonable for a web application and will load quickly on most connections.

## Updating the Hosted Package

To update the hosted package after code changes:

1. Make your code changes in the source
2. Run `./create-hosted-package.sh` again
3. Extract the new package
4. Update config.json files (or copy from old package)
5. Re-deploy to your hosting service

## Comparison: Development vs Hosted

| Feature | Development Package | Hosted Package |
|---------|-------------------|----------------|
| Installation | Requires Node.js + npm | None |
| Setup Time | 5-10 minutes | 1 minute |
| File Size | ~3 MB (source) | ~4.3 MB (built) |
| Can Modify Code | Yes | No |
| Hot Reload | Yes | No |
| Deployment | Local only | Any web server |
| User Experience | Developer-focused | User-friendly |
| Best For | Development | Production/Demos |

## Conclusion

The hosted deployment package makes it easy to share the noise suppression demos with anyone, without requiring them to install Node.js or run terminal commands. It's perfect for demos, presentations, and production deployments.

For development and code review, continue using the development package with the install script.

---

**Questions?** Check the README.md file in the hosted package for more details.

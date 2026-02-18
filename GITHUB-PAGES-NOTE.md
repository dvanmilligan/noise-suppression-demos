# GitHub Pages Deployment Note

## Issue Summary

Static GitHub Pages deployment is **not compatible** with this project due to fundamental dependency incompatibilities.

## Root Cause

The Genesys Cloud WebRTC SDK and its dependencies (specifically `lru-cache` inside `genesys-cloud-streaming-client`) have hardcoded imports to node polyfill shims:

```javascript
import process from 'vite-plugin-node-polyfills/shims/process'
```

These protocol imports cannot be bundled into static assets for GitHub Pages deployment. The dependencies expect these polyfills to be available as external modules, which works for local development but fails in static hosting environments.

## Attempted Solutions

1. Removed `external` declarations from vite.config.ts
2. Set `protocolImports: false` in nodePolyfills plugin
3. Added explicit polyfill includes for process, buffer, util, events, crypto
4. Modified commonjsOptions with `transformMixedEsModules: true`

All attempts failed with the same error:
```
Rollup failed to resolve import "vite-plugin-node-polyfills/shims/process"
```

## Recommended Deployment

For sharing these demos, use one of these approaches:

1. **GitHub Repository** (Recommended): Push source code to GitHub. Users clone and run locally with `npm install` && `npm run dev`
2. **Server-based Hosting**: Deploy to a Node.js-capable server (Heroku, Vercel, Netlify with server functions, etc.)
3. **Docker Container**: Package as a Docker image for easy distribution

## Local Development

The demos work perfectly in local development mode:

```bash
cd react-demo-app  # or react-demo-clearervoice or react-demo-rnnoise
npm install
npm run dev
```

All demos run on port 8443 for OAuth compatibility.

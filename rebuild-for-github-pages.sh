#!/bin/bash

# Rebuild demos for GitHub Pages with correct base path
set -e

echo "🔨 Rebuilding demos for GitHub Pages..."
echo ""

BASE_URL="/noise-suppression-demos"

# Build baseline with base path
echo "Building Baseline demo..."
cd react-demo-app
npm run build -- --base="${BASE_URL}/baseline/"
cd ..

# Build speex with base path
echo "Building Speex demo..."
cd react-demo-clearervoice
npm run build -- --base="${BASE_URL}/speex/"
cd ..

# Build rnnoise with base path
echo "Building RNNoise demo..."
cd react-demo-rnnoise
npm run build -- --base="${BASE_URL}/rnnoise/"
cd ..

echo "✅ All demos rebuilt with base path: $BASE_URL"
echo ""

# Update hosted directory
echo "📁 Updating hosted directory..."
rm -rf noise-suppression-demos-hosted/baseline/assets
rm -rf noise-suppression-demos-hosted/speex/assets
rm -rf noise-suppression-demos-hosted/rnnoise/assets

cp -r react-demo-app/dist/* noise-suppression-demos-hosted/baseline/
cp -r react-demo-clearervoice/dist/* noise-suppression-demos-hosted/speex/
cp -r react-demo-rnnoise/dist/* noise-suppression-demos-hosted/rnnoise/

echo "✅ Hosted directory updated"
echo ""
echo "🚀 Ready to commit and push to GitHub!"

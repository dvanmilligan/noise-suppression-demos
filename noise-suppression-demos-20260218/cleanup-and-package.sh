#!/bin/bash

# Cleanup and Package Script for Noise Suppression Demos
# This script organizes documentation and prepares the project for distribution

set -e

echo "🧹 Starting cleanup and packaging process..."

# Create archive directory
echo "📁 Creating archive directory..."
mkdir -p docs/archive

# Move development documentation to archive
echo "📦 Archiving development documentation..."
mv ABOUT-SECTIONS-ADDED.md docs/archive/ 2>/dev/null || true
mv ADVANCED-MIC-SETTINGS-INTEGRATION.md docs/archive/ 2>/dev/null || true
mv AUDIO-PLAYER-CONTROLS-ADDED.md docs/archive/ 2>/dev/null || true
mv AUDIT-SUMMARY.md docs/archive/ 2>/dev/null || true
mv CALL-RECORDER-AND-DEMO-SWITCHER-IMPROVEMENTS.md docs/archive/ 2>/dev/null || true
mv CLEARERVOICE-INTEGRATION-COMPLETE.md docs/archive/ 2>/dev/null || true
mv DEMO-APPS-OVERVIEW.md docs/archive/ 2>/dev/null || true
mv DEMO-COMPARISON-SPEEX.md docs/archive/ 2>/dev/null || true
mv DEMO-COMPARISON.md docs/archive/ 2>/dev/null || true
mv DEMO-CONSISTENCY-COMPLETE.md docs/archive/ 2>/dev/null || true
mv DEMO-CONSISTENCY-PLAN.md docs/archive/ 2>/dev/null || true
mv DEMO-LAUNCHER-README.md docs/archive/ 2>/dev/null || true
mv FINAL-RNNOISE-CONCLUSION.md docs/archive/ 2>/dev/null || true
mv INTEGRATED-DEMO-LAUNCHER.md docs/archive/ 2>/dev/null || true
mv RNNOISE-DEMO-FEATURES.md docs/archive/ 2>/dev/null || true
mv RNNOISE-SUMMARY.md docs/archive/ 2>/dev/null || true
mv RNNOISE-UI-CONTROLS.md docs/archive/ 2>/dev/null || true
mv SPEEX-ENHANCED-UI.md docs/archive/ 2>/dev/null || true
mv SPEEX-FIX-COMPLETE.md docs/archive/ 2>/dev/null || true
mv SPEEX-FIXES-AND-LAUNCHER.md docs/archive/ 2>/dev/null || true
mv SPEEX-INTEGRATION-COMPLETE.md docs/archive/ 2>/dev/null || true
mv SPEEX-INTEGRATION-SUMMARY.md docs/archive/ 2>/dev/null || true
mv SWITCHING-DEMOS.md docs/archive/ 2>/dev/null || true
mv TOGGLE-DUPLICATE-EVENT-FIX.md docs/archive/ 2>/dev/null || true

# Remove obsolete files
echo "🗑️  Removing obsolete files..."
rm -f demo-launcher.html 2>/dev/null || true
rm -f demo-launcher.js 2>/dev/null || true
rm -f switch-demo.sh 2>/dev/null || true

# Remove ClearerVoice backend (not used)
echo "🗑️  Removing unused backend..."
rm -rf react-demo-clearervoice/backend 2>/dev/null || true

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf react-demo-app/dist 2>/dev/null || true
rm -rf react-demo-clearervoice/dist 2>/dev/null || true
rm -rf react-demo-rnnoise/dist 2>/dev/null || true
rm -rf react-demo-deepfilternet/dist 2>/dev/null || true

# Clean node_modules (optional - uncomment if packaging for distribution)
# echo "🧹 Cleaning node_modules..."
# rm -rf react-demo-app/node_modules 2>/dev/null || true
# rm -rf react-demo-clearervoice/node_modules 2>/dev/null || true
# rm -rf react-demo-rnnoise/node_modules 2>/dev/null || true
# rm -rf react-demo-deepfilternet/node_modules 2>/dev/null || true

echo "✅ Cleanup complete!"
echo ""
echo "📋 Project structure:"
echo "  ├── NOISE-SUPPRESSION-DEMOS-README.md (Main documentation)"
echo "  ├── README.md (SDK documentation)"
echo "  ├── launch-demo.sh (Demo launcher)"
echo "  ├── react-demo-app/ (Baseline demo)"
echo "  ├── react-demo-clearervoice/ (Speex demo)"
echo "  ├── react-demo-rnnoise/ (RNNoise demo)"
echo "  ├── react-demo-deepfilternet/ (DeepFilterNet placeholder)"
echo "  ├── src/ (Core SDK)"
echo "  ├── doc/ (SDK documentation)"
echo "  └── docs/archive/ (Development documentation)"
echo ""
echo "📦 To create a distributable package:"
echo "  tar -czf noise-suppression-demos.tar.gz \\"
echo "    --exclude='node_modules' \\"
echo "    --exclude='.git' \\"
echo "    --exclude='dist' \\"
echo "    --exclude='.DS_Store' \\"
echo "    ."
echo ""
echo "🚀 To test on another computer:"
echo "  1. Extract: tar -xzf noise-suppression-demos.tar.gz"
echo "  2. Install: npm install && cd react-demo-app && npm install"
echo "  3. Configure: Edit react-demo-app/public/config.json"
echo "  4. Run: npm run dev"
echo ""

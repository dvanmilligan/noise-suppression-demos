#!/bin/bash

# Create Distribution Package Script
# This script creates a clean, distributable package for senior developer review

set -e

echo "📦 Creating distribution package for review..."
echo ""

# Run cleanup first
echo "🧹 Running cleanup script..."
./cleanup-and-package.sh

echo ""
echo "📋 Creating package manifest..."

# Create a manifest file
cat > PACKAGE-MANIFEST.txt << 'EOF'
Genesys Cloud WebRTC SDK - Noise Suppression Demos
Distribution Package

Created: $(date)

CONTENTS:
=========

Documentation (Start Here):
---------------------------
1. PACKAGE-FOR-REVIEW.md          - Quick start for reviewers
2. NOISE-SUPPRESSION-DEMOS-README.md - Complete project overview
3. DEVELOPER-GUIDE.md             - Technical deep-dive
4. README.md                      - Original SDK documentation

Demo Applications:
------------------
- react-demo-app/                 - Baseline Demo (Browser Native)
- react-demo-clearervoice/        - Speex Demo (Open-source)
- react-demo-rnnoise/             - RNNoise Demo (AI-based)
- react-demo-deepfilternet/       - DeepFilterNet Demo (Coming Soon)

Core SDK:
---------
- src/                            - WebRTC SDK source code
- doc/                            - SDK API documentation

Utilities:
----------
- install.sh                      - Automated installation script (RECOMMENDED)
- setup-oauth.sh                  - OAuth configuration helper
- launch-demo.sh                  - Interactive demo launcher
- cleanup-and-package.sh          - Cleanup script
- create-package.sh               - This script

Development History:
--------------------
- docs/archive/                   - Development documentation

QUICK START:
============

OPTION 1 - Automated (Recommended):

1. Extract package:
   tar -xzf noise-suppression-demos.tar.gz
   cd genesys-cloud-webrtc-sdk

2. Run installer:
   ./install.sh

3. Open browser:
   https://localhost:8443

OPTION 2 - Manual:

1. Extract package:
   tar -xzf noise-suppression-demos.tar.gz

2. Install dependencies:
   npm install
   cd react-demo-app && npm install && cd ..
   cd react-demo-clearervoice && npm install && cd ..
   cd react-demo-rnnoise && npm install && cd ..

3. Configure OAuth:
   Edit react-demo-app/public/config.json

4. Run a demo:
   cd react-demo-clearervoice
   npm run dev

5. Open browser:
   https://localhost:8443

REVIEW CHECKLIST:
=================

Architecture:
- [ ] Audio processing implementations
- [ ] SDK integration patterns
- [ ] Component structure
- [ ] State management

Code Quality:
- [ ] TypeScript usage
- [ ] Error handling
- [ ] Resource cleanup
- [ ] Code organization

Performance:
- [ ] CPU usage
- [ ] Memory leaks
- [ ] Audio latency
- [ ] UI responsiveness

Security:
- [ ] OAuth implementation
- [ ] Input validation
- [ ] Token handling
- [ ] CSP headers

User Experience:
- [ ] UI intuitiveness
- [ ] Error messages
- [ ] Demo switcher
- [ ] Settings clarity

Browser Compatibility:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

KNOWN ISSUES:
=============

1. RNNoise VAD Issue (High Priority)
   - VAD always returns 0.000
   - See docs/archive/FINAL-RNNOISE-CONCLUSION.md

2. Safari AudioWorklet Support (Medium Priority)
   - Limited support in Safari
   - Fallback to browser NS recommended

3. Port 8443 Requirement (Low Priority)
   - Only one demo can run at a time
   - Demo switcher provides commands

CONTACT:
========

For questions or feedback:
- Create issues in repository
- Contact development team
- Schedule review meeting

EOF

echo "✅ Manifest created"
echo ""

# Create the tarball
echo "📦 Creating tarball..."
PACKAGE_NAME="noise-suppression-demos-$(date +%Y%m%d).tar.gz"

tar -czf "$PACKAGE_NAME" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='coverage' \
  --exclude='.nyc_output' \
  --exclude='*.tgz' \
  --exclude='*.tar.gz' \
  PACKAGE-MANIFEST.txt \
  PACKAGE-FOR-REVIEW.md \
  NOISE-SUPPRESSION-DEMOS-README.md \
  DEVELOPER-GUIDE.md \
  SETUP-INSTRUCTIONS.md \
  QUICK-START-FOR-REVIEWER.txt \
  SECURITY-NOTE.md \
  README.md \
  LICENSE \
  package.json \
  package-lock.json \
  tsconfig.json \
  install.sh \
  setup-oauth.sh \
  launch-demo.sh \
  cleanup-and-package.sh \
  create-package.sh \
  react-demo-app/ \
  react-demo-clearervoice/ \
  react-demo-rnnoise/ \
  react-demo-deepfilternet/ \
  src/ \
  doc/ \
  docs/ \
  2>/dev/null || true

echo "✅ Package created: $PACKAGE_NAME"
echo ""

# Calculate size
SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
echo "📊 Package size: $SIZE"
echo ""

# Show contents summary
echo "📋 Package contents:"
tar -tzf "$PACKAGE_NAME" | head -20
echo "   ... (and more)"
echo ""

echo "✅ Package ready for distribution!"
echo ""
echo "📤 To share with senior developer:"
echo "   1. Upload $PACKAGE_NAME to shared location"
echo "   2. Share PACKAGE-FOR-REVIEW.md as overview"
echo "   3. Provide access to repository (optional)"
echo ""
echo "🧪 To test package locally:"
echo "   mkdir test-extract && cd test-extract"
echo "   tar -xzf ../$PACKAGE_NAME"
echo "   cat PACKAGE-FOR-REVIEW.md"
echo ""

# Create a checksum
echo "🔐 Creating checksum..."
shasum -a 256 "$PACKAGE_NAME" > "$PACKAGE_NAME.sha256"
echo "✅ Checksum created: $PACKAGE_NAME.sha256"
echo ""

echo "🎉 All done!"
echo ""
echo "Package: $PACKAGE_NAME"
echo "Checksum: $PACKAGE_NAME.sha256"
echo "Size: $SIZE"
echo ""

# Quick Reference Card

## 📦 Package Information

**File**: `noise-suppression-demos-20260218.tar.gz`  
**Size**: 2.0 MB  
**Checksum**: Available in `.sha256` file

## 🚀 Quick Start (5 Minutes)

```bash
# Extract
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# Install
npm install
cd react-demo-clearervoice && npm install && cd ..

# Configure (edit with your OAuth credentials)
nano react-demo-clearervoice/public/config.json

# Run
cd react-demo-clearervoice && npm run dev

# Open: https://localhost:8443
```

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| PACKAGE-FOR-REVIEW.md | Quick start for reviewers | 5 min |
| NOISE-SUPPRESSION-DEMOS-README.md | Complete overview | 20 min |
| DEVELOPER-GUIDE.md | Technical deep-dive | 60 min |
| CLEANUP-SUMMARY.md | Organization details | 10 min |

## 🎯 Demo Applications

| Demo | Technology | Port | Status |
|------|-----------|------|--------|
| react-demo-app | Browser Native | 8443 | ✅ Ready |
| react-demo-clearervoice | Speex | 8443 | ✅ Ready |
| react-demo-rnnoise | RNNoise | 8443 | ⚠️ VAD Issue |
| react-demo-deepfilternet | DeepFilterNet | 8443 | 🚧 Coming Soon |

## 🔧 Common Commands

```bash
# Switch demos (kill current, start new)
lsof -ti :8443 | xargs kill -9 2>/dev/null
cd react-demo-<name> && npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Clean
rm -rf dist node_modules
```

## ⚠️ Known Issues

1. **RNNoise VAD**: Always returns 0.000 (use browser NS instead)
2. **Safari**: Limited AudioWorklet support
3. **Port 8443**: Only one demo at a time

## 🔑 Key Files to Review

### Speex Implementation
- `react-demo-clearervoice/src/utils/speexProcessor.ts`
- `react-demo-clearervoice/src/components/SpeexNoiseSuppress.tsx`

### RNNoise Implementation
- `react-demo-rnnoise/public/rnnoise-worklet-processor.js`
- `react-demo-rnnoise/src/utils/rnnoiseProcessor.ts`

### Shared Components
- `src/components/DemoSwitcher.tsx`
- `src/components/AdvancedMicSettings.tsx`
- `src/components/CallRecorder.tsx`

## 🌐 Browser Support

| Browser | Baseline | Speex | RNNoise |
|---------|----------|-------|---------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari | ✅ | ⚠️ | ❌ |

## 📊 Performance Metrics

| Demo | CPU | Memory | Latency |
|------|-----|--------|---------|
| Baseline | <5% | ~10MB | <5ms |
| Speex | ~10% | ~20MB | ~10ms |
| RNNoise | ~20% | ~30MB | ~20ms |

## 🎓 Architecture Highlights

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5.x
- **UI**: Genesys Spark Components
- **Audio**: Web Audio API + AudioWorklet
- **SDK**: Genesys Cloud WebRTC SDK

## 💡 Review Priorities

### High Priority
1. Audio processing implementations
2. SDK integration patterns
3. Resource cleanup
4. Error handling

### Medium Priority
5. Component architecture
6. TypeScript usage
7. Performance optimization
8. User experience

### Low Priority
9. Code style
10. Documentation completeness

## 📞 Support

- **Documentation**: See README files
- **Issues**: Create GitHub issues
- **Questions**: Contact development team

## ✅ Checklist for Reviewers

- [ ] Extract and install package
- [ ] Configure OAuth
- [ ] Test Baseline demo
- [ ] Test Speex demo
- [ ] Test RNNoise demo
- [ ] Review audio processing code
- [ ] Check browser compatibility
- [ ] Verify resource cleanup
- [ ] Test demo switcher
- [ ] Review documentation
- [ ] Provide feedback

---

**Quick Links**:
- Start: PACKAGE-FOR-REVIEW.md
- Overview: NOISE-SUPPRESSION-DEMOS-README.md
- Technical: DEVELOPER-GUIDE.md
- Summary: FINAL-PACKAGE-SUMMARY.md

import { useState, useEffect, useRef } from 'react';
import './SpeexNoiseSuppress.css';
import Card from './Card';
import { getSpeexProcessor } from '../utils/speexProcessor';
import { useSelector } from 'react-redux';
import { RootState } from '../types/store';
import { GuxToggle } from 'genesys-spark-components-react';

export default function SpeexNoiseSuppress() {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [processedFrames, setProcessedFrames] = useState(0);
  const sdk = useSelector((state: RootState) => state.sdk.sdk);
  const toggleRef = useRef<any>(null);
  const isHandlingToggle = useRef(false);
  const animationFrameRef = useRef<number>();

  // Set up event listener for the toggle using ref
  useEffect(() => {
    const toggleElement = toggleRef.current;
    if (!toggleElement) return;

    const handleEvent = () => {
      handleToggle();
    };

    const eventNames = ['check'];
    eventNames.forEach(eventName => {
      toggleElement.addEventListener(eventName, handleEvent);
    });

    return () => {
      eventNames.forEach(eventName => {
        toggleElement.removeEventListener(eventName, handleEvent);
      });
    };
  }, []);

  // Audio level monitoring
  useEffect(() => {
    if (!isActive) {
      setAudioLevel(0);
      setProcessedFrames(0);
      return;
    }

    const updateMetrics = () => {
      const processor = getSpeexProcessor();
      if (processor.isReady()) {
        setAudioLevel(processor.getAudioLevel());
        setProcessedFrames(processor.getProcessedFrames());
      }
      animationFrameRef.current = requestAnimationFrame(updateMetrics);
    };

    animationFrameRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  /**
   * Auto-apply recommended mic settings for Speex:
   * - Disable browser noise suppression (conflicts with Speex)
   * - Keep echo cancellation and auto gain enabled
   */
  async function applyRecommendedMicSettings() {
    if (!sdk) return;
    try {
      console.log('[Speex] Auto-applying recommended mic settings');
      await sdk.updateDefaultMediaSettings({
        micNoiseSuppression: false,
        micEchoCancellation: true,
        micAutoGainControl: true,
        updateActiveSessions: true
      });
      console.log('[Speex] ✅ Applied recommended mic settings: browser NS disabled');
    } catch (err) {
      console.error('[Speex] ❌ Failed to apply recommended mic settings:', err);
    }
  }

  async function handleToggle() {
    if (isHandlingToggle.current) return;
    isHandlingToggle.current = true;

    if (!sdk) {
      console.error('[Speex] SDK not initialized');
      alert('SDK not initialized. Please wait for the app to fully load.');
      isHandlingToggle.current = false;
      return;
    }

    setIsProcessing(true);
    try {
      const processor = getSpeexProcessor();
      const processorIsEnabled = processor.getState();

      if (!processorIsEnabled) {
        // ENABLING
        console.log('[Speex] Enabling Speex noise suppression...');

        if (processor.isReady()) {
          await processor.cleanup();
        }

        // Auto-apply recommended mic settings
        await applyRecommendedMicSettings();

        // Get fresh media stream with recommended settings
        const rawStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: false
          }
        });

        // Initialize Speex with the raw stream
        const processedStream = await processor.initialize(rawStream);
        processor.enable();

        // Tell SDK to use the Speex-processed stream
        sdk.setDefaultAudioStream(processedStream);
        sdk.updateDefaultDevices({ updateActiveSessions: true });

        setIsActive(true);
        console.log('[Speex] ✅ Speex noise suppression enabled');
      } else {
        // DISABLING
        console.log('[Speex] Disabling Speex noise suppression...');

        processor.disable();
        sdk.setDefaultAudioStream(undefined);
        sdk.updateDefaultDevices({ updateActiveSessions: true });
        await processor.cleanup();

        setIsActive(false);
        console.log('[Speex] ✅ Speex noise suppression disabled');
      }
    } catch (error) {
      console.error('[Speex] ❌ Failed to toggle Speex:', error);
      const processor = getSpeexProcessor();
      setIsActive(processor.getState());
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to toggle Speex noise suppression: ${msg}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => { isHandlingToggle.current = false; }, 100);
    }
  }

  const getAudioLevelColor = () => {
    if (audioLevel < 30) return '#28a745';
    if (audioLevel < 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <Card className='speex-container'>
      <div className="speex-header">
        <div className="speex-title">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🎯</span>
          <div>
            <h4>Speex Noise Suppression</h4>
            <p className="speex-subtitle">Open-source, browser-based noise reduction</p>
          </div>
        </div>
      </div>

      <div className="speex-content">
        {!sdk && (
          <div className="warning-box" style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            color: '#856404'
          }}>
            <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span>
            <div>
              <strong>SDK Not Ready</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Please wait for the SDK to initialize before enabling Speex.
              </p>
            </div>
          </div>
        )}

        <div className="status-row">
          <div className="status-item">
            <span className="status-label">Status:</span>
            <span className={`status-value ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? '🟢 Active' : '⚪ Inactive'}
            </span>
          </div>
          {isActive && processedFrames > 0 && (
            <div className="frames-processed">
              {processedFrames.toLocaleString()} frames processed
            </div>
          )}
        </div>

        {isActive && (
          <div className="audio-level-container">
            <div className="audio-level-header">
              <span>Audio Activity Level</span>
              <span className="audio-level-value">{audioLevel}%</span>
            </div>
            <div className="audio-level-bar">
              <div
                className="audio-level-fill"
                style={{
                  width: `${audioLevel}%`,
                  backgroundColor: getAudioLevelColor(),
                  transition: 'width 0.1s ease, background-color 0.3s ease'
                }}
              />
            </div>
            <div className="audio-level-labels">
              <span className="audio-label-low">Silence</span>
              <span className="audio-label-medium">Speech</span>
              <span className="audio-label-high">Active</span>
            </div>
          </div>
        )}

        <div className="speex-toggle">
          <GuxToggle
            ref={toggleRef}
            checked={isActive}
            disabled={isProcessing || !sdk}
          >
            <span slot="label">
              {isActive ? 'Disable' : 'Enable'} Speex Noise Suppression
              {!sdk && ' (SDK not ready)'}
            </span>
          </GuxToggle>
        </div>

        <div className="info-box-collapsible">
          <div 
            className="info-box-header" 
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
            <strong>About Speex</strong>
            <span className="expand-icon">{isAboutExpanded ? '▲' : '▼'}</span>
          </div>
          {isAboutExpanded && (
            <div className="info-box-content">
              <p>
                Speex is an open-source audio codec designed for speech. It provides excellent 
                noise suppression for voice calls and runs entirely in your browser with zero latency.
              </p>
              <ul>
                <li>✓ Real-time processing (~0ms latency)</li>
                <li>✓ Open-source (BSD license)</li>
                <li>✓ No backend server required</li>
                <li>✓ Proven technology (used in VoIP for years)</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

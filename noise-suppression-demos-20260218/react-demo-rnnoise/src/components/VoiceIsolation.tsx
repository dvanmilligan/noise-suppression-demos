import { useState, useEffect, useRef } from 'react';
import './VoiceIsolation.css';
import { GuxToggle } from 'genesys-spark-components-react';
import Card from './Card';
import { getRNNoiseProcessor } from '../utils/rnnoiseProcessor';
import { logInfo, logSuccess, logError } from '../utils/logger';
import { useSelector } from 'react-redux';
import { RootState } from '../types/store';

export default function VoiceIsolation() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [processedFrames, setProcessedFrames] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const sdk = useSelector((state: RootState) => state.sdk.sdk);
  const toggleRef = useRef<any>(null);
  const isHandlingToggle = useRef(false);

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

  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      const processor = getRNNoiseProcessor();
      setNoiseLevel(processor.getNoiseLevel());
      setProcessedFrames(processor.getProcessedFrames());
    }, 100);

    return () => clearInterval(interval);
  }, [isEnabled]);

  /**
   * Auto-apply recommended mic settings for RNNoise:
   * - Disable browser noise suppression (conflicts with RNNoise)
   * - Keep echo cancellation and auto gain enabled
   */
  async function applyRecommendedMicSettings() {
    if (!sdk) return;
    try {
      logInfo('VOICE_ISOLATION', 'Auto-applying recommended mic settings for RNNoise');
      await sdk.updateDefaultMediaSettings({
        micNoiseSuppression: false,
        micEchoCancellation: true,
        micAutoGainControl: true,
        updateActiveSessions: true
      });
      logSuccess('VOICE_ISOLATION', 'Applied recommended mic settings: browser NS disabled');
    } catch (err) {
      logError('VOICE_ISOLATION', 'Failed to apply recommended mic settings', err);
    }
  }

  async function handleToggle() {
    if (isHandlingToggle.current) return;
    isHandlingToggle.current = true;

    if (!sdk) {
      logError('VOICE_ISOLATION', 'SDK not initialized');
      alert('SDK not initialized. Please wait for the app to fully load.');
      isHandlingToggle.current = false;
      return;
    }

    setIsProcessing(true);
    try {
      const processor = getRNNoiseProcessor();
      const processorIsEnabled = processor.getState();

      if (!processorIsEnabled) {
        // ENABLING
        logInfo('VOICE_ISOLATION', 'Enabling RNNoise voice isolation...');

        if (processor.isReady()) {
          await processor.cleanup();
        }

        // Auto-apply recommended mic settings
        await applyRecommendedMicSettings();

        const rawStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: false
          }
        });

        const processedStream = await processor.initialize(rawStream);
        processor.enable();

        sdk.setDefaultAudioStream(processedStream);
        sdk.updateDefaultDevices({ updateActiveSessions: true });

        setIsEnabled(true);
        logSuccess('VOICE_ISOLATION', 'RNNoise voice isolation enabled');
      } else {
        // DISABLING
        logInfo('VOICE_ISOLATION', 'Disabling RNNoise voice isolation...');

        processor.disable();
        sdk.setDefaultAudioStream(undefined);
        sdk.updateDefaultDevices({ updateActiveSessions: true });
        await processor.cleanup();

        setIsEnabled(false);
        setNoiseLevel(0);
        setProcessedFrames(0);
        logSuccess('VOICE_ISOLATION', 'RNNoise voice isolation disabled');
      }
    } catch (error) {
      logError('VOICE_ISOLATION', 'Failed to toggle RNNoise', error);
      const processor = getRNNoiseProcessor();
      setIsEnabled(processor.getState());
      const msg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to toggle voice isolation: ${msg}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => { isHandlingToggle.current = false; }, 100);
    }
  }

  const getNoiseIndicatorColor = () => {
    if (noiseLevel < 30) return '#28a745';
    if (noiseLevel < 60) return '#ffc107';
    return '#dc3545';
  };

  return (
    <Card className='voice-isolation-container'>
      <h4>Voice Isolation (RNNoise)</h4>
      <div className="voice-isolation-content">
        {!sdk && (
          <div className="sdk-not-ready-warning" style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            color: '#856404'
          }}>
            <strong>⚠️ SDK Not Ready</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              Please wait for the SDK to initialize before enabling voice isolation.
            </p>
          </div>
        )}

        <div className="voice-isolation-info">
          <div className="status-row">
            <div className="status-indicator">
              <span className={`status-dot ${isEnabled ? 'active' : 'inactive'}`}></span>
              <span className="status-text">
                {isEnabled ? 'Active' : 'Inactive'}
              </span>
            </div>
            {isEnabled && processedFrames > 0 && (
              <div className="frames-processed">
                {processedFrames.toLocaleString()} frames processed
              </div>
            )}
          </div>
        </div>

        {isEnabled && (
          <div className="noise-level-container">
            <div className="noise-level-header">
              <span>Audio Activity Level</span>
              <span className="noise-level-value">{noiseLevel}%</span>
            </div>
            <div className="noise-level-bar">
              <div
                className="noise-level-fill"
                style={{
                  width: `${noiseLevel}%`,
                  backgroundColor: getNoiseIndicatorColor(),
                  transition: 'width 0.2s ease, background-color 0.3s ease'
                }}
              />
            </div>
            <div className="noise-level-labels">
              <span className="noise-label-low">Silence</span>
              <span className="noise-label-medium">Speech</span>
              <span className="noise-label-high">Active</span>
            </div>
          </div>
        )}

        <div className="voice-isolation-toggle">
          <GuxToggle
            ref={toggleRef}
            checked={isEnabled}
            disabled={isProcessing || !sdk}
          >
            <span slot="label">
              {isEnabled ? 'Disable' : 'Enable'} Voice Isolation
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
            <strong>About RNNoise</strong>
            <span className="expand-icon">{isAboutExpanded ? '▲' : '▼'}</span>
          </div>
          {isAboutExpanded && (
            <div className="info-box-content">
              <p>
                RNNoise is a noise suppression library based on a recurrent neural network. 
                It runs in real-time in your browser using WebAssembly.
              </p>
              <ul>
                <li>✓ Real-time processing (&lt;10ms latency)</li>
                <li>✓ Open-source (BSD-3-Clause license)</li>
                <li>✓ No backend server required</li>
                <li>✓ Developed by Xiph.Org Foundation</li>
              </ul>
              <p style={{ marginTop: '10px', fontSize: '13px', fontStyle: 'italic' }}>
                <strong>Note:</strong> RNNoise VAD (Voice Activity Detection) may not work optimally 
                with all audio sources. For production use, consider Speex or browser-native noise suppression.
              </p>
            </div>
          )}
        </div>

        <div className="voice-isolation-details">
          <small>
            <strong>Technology:</strong> RNNoise (Xiph.Org Foundation)<br/>
            <strong>License:</strong> BSD-3-Clause<br/>
            <strong>Latency:</strong> &lt;10ms
          </small>
        </div>
      </div>
    </Card>
  );
}

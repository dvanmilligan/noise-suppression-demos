import { useState } from 'react';
import './SpeexSettings.css';
import Card from './Card';

export default function SpeexSettings() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className='speex-settings-container'>
      <div className="speex-settings-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="speex-settings-title">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🎛️</span>
          <h4>Speex Information</h4>
        </div>
        <span style={{ fontSize: '20px' }}>{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div className="speex-settings-content">
          <div className="info-section">
            <h5>📊 How Speex Works</h5>
            <p>
              Speex uses a sophisticated preprocessing algorithm that analyzes audio in real-time 
              to distinguish between speech and noise. The algorithm automatically adapts to your 
              audio environment.
            </p>
          </div>

          <div className="info-section">
            <h5>🎯 What Speex Suppresses</h5>
            <div className="suppression-grid">
              <div className="suppression-item good">
                <span className="suppression-icon">✅</span>
                <div>
                  <strong>Excellent Suppression</strong>
                  <ul>
                    <li>Keyboard typing</li>
                    <li>Fan noise</li>
                    <li>Air conditioning</li>
                    <li>Steady background hum</li>
                  </ul>
                </div>
              </div>
              <div className="suppression-item moderate">
                <span className="suppression-icon">⚠️</span>
                <div>
                  <strong>Moderate Suppression</strong>
                  <ul>
                    <li>Background conversations</li>
                    <li>Music</li>
                    <li>Variable noise</li>
                    <li>Traffic sounds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h5>⚙️ Configuration</h5>
            <p>
              The Speex library uses optimized default parameters that work well for most scenarios. 
              Unlike some other noise suppression solutions, Speex doesn't expose manual configuration 
              options - it automatically adapts to your audio.
            </p>
            <div className="config-note">
              <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
              <div>
                <strong>Automatic Optimization</strong>
                <p>
                  Speex continuously analyzes your audio and adjusts its processing in real-time. 
                  This "set it and forget it" approach ensures consistent performance without manual tuning.
                </p>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h5>📈 Performance Metrics</h5>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Latency</span>
                <span className="metric-value">~0ms</span>
                <span className="metric-description">Real-time processing</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Sample Rate</span>
                <span className="metric-value">48kHz</span>
                <span className="metric-description">High quality audio</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Channels</span>
                <span className="metric-value">Stereo</span>
                <span className="metric-description">2-channel support</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">CPU Usage</span>
                <span className="metric-value">Low</span>
                <span className="metric-description">Efficient processing</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h5>🔧 Optimization Tips</h5>
            <ul className="tips-list">
              <li>
                <strong>Disable browser noise suppression</strong> - Use the "Apply Recommended Settings" 
                button in Advanced Mic Settings to avoid conflicts
              </li>
              <li>
                <strong>Use a quality microphone</strong> - Better input quality leads to better noise suppression
              </li>
              <li>
                <strong>Test in your environment</strong> - Use the CallRecorder to compare raw vs processed audio
              </li>
              <li>
                <strong>Monitor audio levels</strong> - Watch the Audio Activity Level meter to ensure proper input
              </li>
            </ul>
          </div>

          <div className="info-section">
            <h5>📚 Technical Details</h5>
            <div className="tech-details">
              <div className="tech-item">
                <span className="tech-label">Library:</span>
                <span className="tech-value">Speex DSP</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">License:</span>
                <span className="tech-value">BSD-3-Clause (Open Source)</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Implementation:</span>
                <span className="tech-value">WebAssembly + AudioWorklet</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Processing:</span>
                <span className="tech-value">Preprocessing + Noise Suppression</span>
              </div>
            </div>
          </div>

          <div className="settings-note">
            <span style={{ fontSize: '16px', marginRight: '8px' }}>ℹ️</span>
            <small>
              <strong>Note:</strong> Speex is designed for speech and works best with voice audio. 
              For music or complex audio, consider using browser's built-in noise suppression instead.
            </small>
          </div>
        </div>
      )}
    </Card>
  );
}

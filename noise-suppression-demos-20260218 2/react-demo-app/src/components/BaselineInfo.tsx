import { useState } from 'react';
import './BaselineInfo.css';
import Card from './Card';

export default function BaselineInfo() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <Card className='baseline-info-container'>
      <div className="baseline-info-header">
        <div className="baseline-info-title">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>📊</span>
          <div>
            <h4>Baseline Demo</h4>
            <p className="baseline-info-subtitle">Standard WebRTC with browser-native audio processing</p>
          </div>
        </div>
      </div>

      <div className="baseline-info-content">
        <div className="info-box-collapsible">
          <div 
            className="info-box-header" 
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
            <strong>About Baseline</strong>
            <span className="expand-icon">{isAboutExpanded ? '▲' : '▼'}</span>
          </div>
          {isAboutExpanded && (
            <div className="info-box-content">
              <p>
                This is the baseline demo using standard WebRTC with browser-native audio processing. 
                It serves as a reference point for comparing noise suppression technologies.
              </p>
              <ul>
                <li>✓ Standard WebRTC implementation</li>
                <li>✓ Browser-native echo cancellation</li>
                <li>✓ Browser-native auto gain control</li>
                <li>✓ Optional browser-native noise suppression</li>
              </ul>
              <p style={{ marginTop: '10px', fontSize: '13px' }}>
                <strong>Use this demo to:</strong> Establish a baseline for audio quality and compare 
                the effectiveness of advanced noise suppression technologies (RNNoise, Speex).
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

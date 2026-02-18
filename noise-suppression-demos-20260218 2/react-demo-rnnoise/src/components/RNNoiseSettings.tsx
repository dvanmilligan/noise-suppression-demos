import { useState } from 'react';
import './RNNoiseSettings.css';
import Card from './Card';
import { getRNNoiseProcessor } from '../utils/rnnoiseProcessor';
import { logInfo, logSuccess } from '../utils/logger';

export default function RNNoiseSettings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputGain, setInputGain] = useState(1.0);
  const [vadCompensation, setVadCompensation] = useState(2.0);
  const [outputGain, setOutputGain] = useState(1.0);

  const handleInputGainChange = (value: number) => {
    setInputGain(value);
    const processor = getRNNoiseProcessor();
    if (processor.isReady()) {
      processor.updateSettings({ inputGain: value });
      logInfo('RNNOISE_SETTINGS', `Input gain set to ${value.toFixed(1)}x`);
    }
  };

  const handleVadCompensationChange = (value: number) => {
    setVadCompensation(value);
    const processor = getRNNoiseProcessor();
    if (processor.isReady()) {
      processor.updateSettings({ vadCompensation: value });
      logInfo('RNNOISE_SETTINGS', `VAD compensation set to ${value.toFixed(1)}x`);
    }
  };

  const handleOutputGainChange = (value: number) => {
    setOutputGain(value);
    const processor = getRNNoiseProcessor();
    if (processor.isReady()) {
      processor.updateSettings({ outputGain: value });
      logInfo('RNNOISE_SETTINGS', `Output gain set to ${value.toFixed(1)}x`);
    }
  };

  const resetToDefaults = () => {
    setInputGain(1.0);
    setVadCompensation(2.0);
    setOutputGain(1.0);
    const processor = getRNNoiseProcessor();
    if (processor.isReady()) {
      processor.updateSettings({ 
        inputGain: 1.0, 
        vadCompensation: 2.0, 
        outputGain: 1.0 
      });
      logSuccess('RNNOISE_SETTINGS', 'Reset to default settings');
    }
  };

  return (
    <Card className='rnnoise-settings-container'>
      <div className="rnnoise-settings-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="rnnoise-settings-title">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🎛️</span>
          <h4>RNNoise Advanced Settings</h4>
        </div>
        <span style={{ fontSize: '20px' }}>{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div className="rnnoise-settings-content">
          <p className="settings-description">
            Adjust RNNoise processing parameters to optimize noise suppression for your audio setup.
          </p>

          <div className="settings-list">
            {/* Input Gain */}
            <div className="setting-item">
              <div className="setting-header">
                <label className="setting-label">
                  <strong>Input Gain</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Amplifies audio before RNNoise processing. Higher values may help VAD detect voice."
                  >
                    ❓
                  </span>
                </label>
                <span className="setting-value">{inputGain.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={inputGain}
                onChange={(e) => handleInputGainChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
              <div className="setting-range-labels">
                <span>0.5x (Quieter)</span>
                <span>8.0x (Louder)</span>
              </div>
              <p className="setting-description">
                Boosts audio amplitude before RNNoise processes it. Try higher values (4x-8x) if VAD isn't detecting voice.
              </p>
            </div>

            {/* VAD Compensation */}
            <div className="setting-item">
              <div className="setting-header">
                <label className="setting-label">
                  <strong>VAD Compensation</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Boosts output when VAD is low to counteract over-suppression"
                  >
                    ❓
                  </span>
                </label>
                <span className="setting-value">{vadCompensation.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.5"
                value={vadCompensation}
                onChange={(e) => handleVadCompensationChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
              <div className="setting-range-labels">
                <span>1.0x (No compensation)</span>
                <span>4.0x (Max compensation)</span>
              </div>
              <p className="setting-description">
                When VAD=0 (no voice detected), RNNoise over-suppresses. This boosts the output to compensate.
              </p>
            </div>

            {/* Output Gain */}
            <div className="setting-item">
              <div className="setting-header">
                <label className="setting-label">
                  <strong>Output Gain</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Final volume adjustment after RNNoise processing"
                  >
                    ❓
                  </span>
                </label>
                <span className="setting-value">{outputGain.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={outputGain}
                onChange={(e) => handleOutputGainChange(parseFloat(e.target.value))}
                className="setting-slider"
              />
              <div className="setting-range-labels">
                <span>0.5x (Quieter)</span>
                <span>3.0x (Louder)</span>
              </div>
              <p className="setting-description">
                Final volume adjustment. Use this if processed audio is too quiet or too loud.
              </p>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              className="reset-button"
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </button>
          </div>

          <div className="settings-note">
            <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
            <small>
              <strong>Tip:</strong> If VAD consistently shows 0.000, try increasing Input Gain to 4x-8x. 
              If audio sounds distorted, increase VAD Compensation to 3x-4x.
            </small>
          </div>
        </div>
      )}
    </Card>
  );
}

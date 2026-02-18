import { useState, useEffect } from 'react';
import './AdvancedMicSettings.css';
import { GuxToggle } from 'genesys-spark-components-react';
import Card from './Card';
import { useSelector } from 'react-redux';
import { RootState } from '../types/store';

export default function AdvancedMicSettings() {
  const sdk = useSelector((state: RootState) => state.sdk.sdk);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoGainControl, setAutoGainControl] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load current settings from SDK
    if (sdk && sdk._config && sdk._config.defaults) {
      setAutoGainControl(sdk._config.defaults.micAutoGainControl ?? true);
      setEchoCancellation(sdk._config.defaults.micEchoCancellation ?? true);
      setNoiseSuppression(sdk._config.defaults.micNoiseSuppression ?? true);
      
      console.log('[MIC_SETTINGS] Loaded current mic settings', {
        autoGainControl: sdk._config.defaults.micAutoGainControl,
        echoCancellation: sdk._config.defaults.micEchoCancellation,
        noiseSuppression: sdk._config.defaults.micNoiseSuppression
      });
    }
  }, [sdk]);

  const updateSetting = async (setting: string, value: boolean) => {
    if (!sdk) {
      console.warn('[MIC_SETTINGS] SDK not initialized');
      return;
    }

    setIsUpdating(true);
    try {
      const settings: any = {
        updateActiveSessions: true
      };
      
      if (setting === 'autoGainControl') {
        settings.micAutoGainControl = value;
        setAutoGainControl(value);
      } else if (setting === 'echoCancellation') {
        settings.micEchoCancellation = value;
        setEchoCancellation(value);
      } else if (setting === 'noiseSuppression') {
        settings.micNoiseSuppression = value;
        setNoiseSuppression(value);
      }

      await sdk.updateDefaultMediaSettings(settings);
      console.log(`[MIC_SETTINGS] ✅ Updated ${setting} to ${value}`);
    } catch (error) {
      console.warn(`[MIC_SETTINGS] ❌ Failed to update ${setting}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const recommendedForSpeex = () => {
    return (
      <div className="recommendation-banner">
        <span style={{ fontSize: '20px', marginRight: '10px' }}>ℹ️</span>
        <div>
          <strong>Recommended for Speex:</strong>
          <p>
            Disable "Noise Suppression On" to avoid conflicts with Speex processing.
            Browser noise suppression and Speex should not run simultaneously.
          </p>
          <button 
            className="apply-recommended-btn"
            onClick={applyRecommendedSettings}
            disabled={isUpdating}
          >
            Apply Recommended Settings
          </button>
        </div>
      </div>
    );
  };

  const applyRecommendedSettings = async () => {
    console.log('[MIC_SETTINGS] Applying recommended settings for Speex');
    
    // Keep echo cancellation and auto gain, but disable browser noise suppression
    await updateSetting('noiseSuppression', false);
    
    console.log('[MIC_SETTINGS] ✅ Applied recommended settings: Browser noise suppression disabled');
  };

  const getConflictWarning = () => {
    if (noiseSuppression) {
      return (
        <div className="conflict-warning">
          <span style={{ fontSize: '20px', marginRight: '10px' }}>⚠️</span>
          <span>
            Browser noise suppression is ON. This may conflict with Speex and reduce effectiveness.
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className='advanced-mic-settings-container'>
      <div className="advanced-mic-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="advanced-mic-title">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🎤</span>
          <h4>Advanced Mic Settings</h4>
        </div>
        <span style={{ fontSize: '20px' }}>{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div className="advanced-mic-content">
          <p className="settings-description">
            Microphone sound processing usually produces peak audio. Some environments and 
            hardware configurations may yield a better experience by disabling some, or all, 
            of the sound processing.
          </p>

          {recommendedForSpeex()}
          {getConflictWarning()}

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">
                  <strong>Automatic Mic Gain On</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Automatically adjusts microphone volume to maintain consistent audio levels"
                  >
                    ❓
                  </span>
                </div>
                <p className="setting-description">
                  Automatically adjusts microphone volume. Generally safe to keep enabled with Speex.
                </p>
              </div>
              <GuxToggle
                checked={autoGainControl}
                disabled={isUpdating}
                onInput={() => updateSetting('autoGainControl', !autoGainControl)}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">
                  <strong>Echo Cancellation On</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Prevents echo by filtering out sounds from your speakers"
                  >
                    ❓
                  </span>
                </div>
                <p className="setting-description">
                  Prevents echo effects. Should remain enabled with Speex.
                </p>
              </div>
              <GuxToggle
                checked={echoCancellation}
                disabled={isUpdating}
                onInput={() => updateSetting('echoCancellation', !echoCancellation)}
              />
            </div>

            <div className={`setting-item ${noiseSuppression ? 'conflict' : ''}`}>
              <div className="setting-info">
                <div className="setting-label">
                  <strong>Noise Suppression On</strong>
                  <span 
                    style={{ fontSize: '16px', marginLeft: '8px', cursor: 'help' }}
                    title="Browser's built-in noise suppression - conflicts with Speex"
                  >
                    ❓
                  </span>
                  {noiseSuppression && (
                    <span className="conflict-badge">⚠️ Conflicts with Speex</span>
                  )}
                </div>
                <p className="setting-description">
                  Browser's built-in noise suppression. <strong>Should be DISABLED when using Speex</strong> to avoid double-processing.
                </p>
              </div>
              <GuxToggle
                checked={noiseSuppression}
                disabled={isUpdating}
                onInput={() => updateSetting('noiseSuppression', !noiseSuppression)}
              />
            </div>
          </div>

          <div className="settings-note">
            <span style={{ fontSize: '16px', marginRight: '8px' }}>ℹ️</span>
            <small>
              Changes apply immediately to active calls. Browser settings are separate from Speex processing.
            </small>
          </div>
        </div>
      )}
    </Card>
  );
}

import { useState, useRef } from 'react';
import './ClearerVoiceEnhancer.css';
import Card from './Card';

interface Model {
  name: string;
  description: string;
  sample_rate: number;
  pesq: number;
  stoi: number;
}

interface JobStatus {
  job_id: string;
  status: string;
  progress: number;
  download_url?: string;
  error?: string;
}

const API_BASE = 'http://localhost:8000';

export default function ClearerVoiceEnhancer() {
  const [selectedModel, setSelectedModel] = useState('MossFormer2_SE_48K');
  const [models, setModels] = useState<Model[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enhancedAudioUrl, setEnhancedAudioUrl] = useState<string | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalAudioRef = useRef<HTMLAudioElement>(null);
  const enhancedAudioRef = useRef<HTMLAudioElement>(null);

  // Load available models on mount
  useState(() => {
    fetch(`${API_BASE}/api/models`)
      .then(res => res.json())
      .then(data => setModels(data.models))
      .catch(err => console.error('Failed to load models:', err));
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL for original audio
      const url = URL.createObjectURL(file);
      setOriginalAudioUrl(url);
      setEnhancedAudioUrl(null);
      setError(null);
    }
  };

  const handleEnhance = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setEnhancedAudioUrl(null);

    try {
      // Upload file for enhancement
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_name', selectedModel);

      const response = await fetch(`${API_BASE}/api/enhance`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Enhancement failed: ${response.statusText}`);
      }

      const result = await response.json();
      setJobId(result.job_id);

      // Poll for status
      await pollJobStatus(result.job_id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enhancement failed');
      setIsProcessing(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const maxAttempts = 60; // 30 seconds max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/status/${jobId}`);
        const status: JobStatus = await response.json();

        setProgress(status.progress);

        if (status.status === 'completed') {
          // Download enhanced audio
          const downloadUrl = `${API_BASE}${status.download_url}`;
          setEnhancedAudioUrl(downloadUrl);
          setIsProcessing(false);
          return;
        }

        if (status.status === 'failed') {
          setError(status.error || 'Enhancement failed');
          setIsProcessing(false);
          return;
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 500);
        } else {
          setError('Enhancement timeout');
          setIsProcessing(false);
        }
      } catch (err) {
        setError('Failed to check status');
        setIsProcessing(false);
      }
    };

    poll();
  };

  const handleCleanup = async () => {
    if (jobId) {
      try {
        await fetch(`${API_BASE}/api/cleanup/${jobId}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Cleanup failed:', err);
      }
    }
    
    // Reset state
    setJobId(null);
    setEnhancedAudioUrl(null);
    setOriginalAudioUrl(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className='clearervoice-container'>
      <div className="clearervoice-header">
        <span style={{ fontSize: '24px', marginRight: '10px' }}>🎯</span>
        <h3>ClearerVoice Audio Enhancement</h3>
      </div>

      <div className="clearervoice-content">
        {/* Model Selection */}
        <div className="model-selection">
          <label>
            <strong>Enhancement Model:</strong>
          </label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isProcessing}
          >
            {models.map(model => (
              <option key={model.name} value={model.name}>
                {model.description} (PESQ: {model.pesq})
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="file-upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={isProcessing}
          />
          <button 
            onClick={handleEnhance}
            disabled={isProcessing || !originalAudioUrl}
            className="enhance-button"
          >
            {isProcessing ? 'Processing...' : 'Enhance Audio'}
          </button>
          {(originalAudioUrl || enhancedAudioUrl) && (
            <button 
              onClick={handleCleanup}
              disabled={isProcessing}
              className="cleanup-button"
            >
              Clear
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Audio Comparison */}
        {(originalAudioUrl || enhancedAudioUrl) && (
          <div className="audio-comparison">
            {/* Original Audio */}
            {originalAudioUrl && (
              <div className="audio-player">
                <h4>📼 Original Audio</h4>
                <audio 
                  ref={originalAudioRef}
                  src={originalAudioUrl} 
                  controls 
                />
              </div>
            )}

            {/* Enhanced Audio */}
            {enhancedAudioUrl && (
              <div className="audio-player">
                <h4>✨ Enhanced Audio</h4>
                <audio 
                  ref={enhancedAudioRef}
                  src={enhancedAudioUrl} 
                  controls 
                />
                <a 
                  href={enhancedAudioUrl} 
                  download="enhanced_audio.wav"
                  className="download-link"
                >
                  💾 Download Enhanced Audio
                </a>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="info-box">
          <span style={{ fontSize: '16px', marginRight: '8px' }}>💡</span>
          <small>
            <strong>Tip:</strong> ClearerVoice uses AI models to remove background noise and enhance speech clarity. 
            Processing happens on the backend server. Make sure the Python backend is running on port 8000.
          </small>
        </div>
      </div>
    </Card>
  );
}

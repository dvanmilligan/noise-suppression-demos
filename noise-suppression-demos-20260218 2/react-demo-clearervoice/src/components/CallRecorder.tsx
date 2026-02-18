import { useState, useEffect, useRef } from 'react';
import './CallRecorder.css';
import { GuxButton } from 'genesys-spark-components-react';
import Card from './Card';
import { getAudioRecorder, downloadRecordingWithMetadata, RecordingMetadata } from '../utils/audioRecorder';
import { getSpeexProcessor } from '../utils/speexProcessor';
import { useSelector } from 'react-redux';
import { RootState } from '../types/store';

export default function CallRecorder() {
  const sdk = useSelector((state: RootState) => state.sdk.sdk);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [lastRecording, setLastRecording] = useState<{
    raw: Blob;
    processed: Blob;
    metadata: RecordingMetadata;
  } | null>(null);

  // Audio player state
  const [playingType, setPlayingType] = useState<'raw' | 'processed' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Setup audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setPlayingType(null);
      setIsPaused(false);
      setCurrentTime(0);
      console.log('[RECORDER_UI] Playback ended');
    };

    const handlePlay = () => {
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPaused(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playingType]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      console.log('[RECORDER_UI] Starting call recording...');

      // Get Speex processor state
      const speexProcessor = getSpeexProcessor();
      const speexEnabled = speexProcessor.getState();
      
      // Get browser NS state from SDK config
      let browserNSEnabled = true; // Default to true if we can't read it
      if (sdk && sdk._config) {
        // Try to read from SDK config, but it might not have these properties
        browserNSEnabled = true; // Default assumption
        console.log(`[RECORDER_UI] Browser NS state: assuming ${browserNSEnabled}`);
      } else {
        console.warn('[RECORDER_UI] Could not read browser NS state from SDK, assuming enabled');
      }

      let rawStream: MediaStream;
      let processedStream: MediaStream;

      if (speexEnabled && speexProcessor.isReady()) {
        // Speex is active - get both raw and processed streams
        console.log('[RECORDER_UI] Speex is active - capturing raw and processed streams');
        
        const raw = speexProcessor.getRawStream();
        const processed = speexProcessor.getProcessedStream();
        
        if (!raw || !processed) {
          throw new Error('Speex streams not available');
        }
        
        rawStream = raw;
        processedStream = processed;
        
        // CRITICAL: Verify streams are actually different
        const rawId = rawStream.id;
        const processedId = processedStream.id;
        const rawTrackId = rawStream.getAudioTracks()[0]?.id;
        const processedTrackId = processedStream.getAudioTracks()[0]?.id;
        
        console.log('[RECORDER_UI] ✅ Stream verification', {
          rawStreamId: rawId,
          processedStreamId: processedId,
          rawTrackId: rawTrackId,
          processedTrackId: processedTrackId,
          streamsAreDifferent: rawId !== processedId,
          tracksAreDifferent: rawTrackId !== processedTrackId
        });
        
        if (rawId === processedId) {
          console.warn('[RECORDER_UI] ⚠️ WARNING: Raw and processed streams have the SAME ID!');
        }
        if (rawTrackId === processedTrackId) {
          console.warn('[RECORDER_UI] ⚠️ WARNING: Raw and processed tracks have the SAME ID!');
        }
        
        console.log('[RECORDER_UI] ✅ Using Speex raw and processed streams');
      } else {
        // Speex not active - get current microphone stream
        console.log('[RECORDER_UI] Speex not active - using current microphone stream');
        
        // Get a fresh stream with the SDK's configured browser NS setting
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              autoGainControl: true,
              noiseSuppression: browserNSEnabled
            }
          });
          
          // Read actual constraints from the track to verify what the browser applied
          const audioTrack = stream.getAudioTracks()[0];
          const settings = audioTrack.getSettings();
          const actualBrowserNS = settings.noiseSuppression;
          
          console.log('[RECORDER_UI] Browser NS verification', {
            sdkConfig: browserNSEnabled,
            requested: browserNSEnabled,
            actualApplied: actualBrowserNS,
            match: actualBrowserNS === browserNSEnabled
          });
          
          // Use the ACTUAL value from the browser, not what we requested
          if (actualBrowserNS !== undefined) {
            browserNSEnabled = actualBrowserNS;
          }
          
          if (actualBrowserNS !== browserNSEnabled) {
            console.warn(`[RECORDER_UI] ⚠️ Browser NS mismatch! Requested: ${browserNSEnabled}, Got: ${actualBrowserNS}`);
          }
        } catch (error) {
          console.warn('[RECORDER_UI] Failed to get fresh stream, using default', error);
          // Fallback: create a basic stream
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = stream.getAudioTracks()[0];
          const settings = audioTrack.getSettings();
          browserNSEnabled = settings.noiseSuppression ?? true;
        }
        
        // Both streams are the same when Speex is not active
        rawStream = stream;
        processedStream = stream;
        
        console.warn('[RECORDER_UI] Recording same stream for both raw and processed (Speex not active)');
      }

      // Get sample rate from the stream
      const audioTrack = rawStream.getAudioTracks()[0];
      const settings = audioTrack.getSettings();
      const sampleRate = settings.sampleRate || 48000;

      console.log('[RECORDER_UI] Stream details', {
        sampleRate,
        speexEnabled,
        browserNSEnabled,
        rawTracks: rawStream.getAudioTracks().length,
        processedTracks: processedStream.getAudioTracks().length
      });

      const recorder = getAudioRecorder();
      await recorder.startRecording(rawStream, processedStream, speexEnabled, browserNSEnabled);
      
      setIsRecording(true);
      setHasRecording(false);
      console.log('[RECORDER_UI] ✅ Recording started');
    } catch (error) {
      console.warn('[RECORDER_UI] ❌ Failed to start recording:', error);
      alert('Failed to start recording. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('[RECORDER_UI] Stopping call recording...');
      
      const recorder = getAudioRecorder();
      const result = await recorder.stopRecording();
      
      setLastRecording(result);
      setIsRecording(false);
      setHasRecording(true);
      
      console.log('[RECORDER_UI] ✅ Recording stopped', {
        duration: result.metadata.duration,
        speexEnabled: result.metadata.speexEnabled,
        browserNSEnabled: result.metadata.browserNSEnabled
      });
    } catch (error) {
      console.warn('[RECORDER_UI] ❌ Failed to stop recording:', error);
    }
  };

  const downloadRecordings = () => {
    if (!lastRecording) return;

    downloadRecordingWithMetadata(
      lastRecording.raw,
      lastRecording.processed,
      lastRecording.metadata
    );

    console.log('[RECORDER_UI] ✅ Downloaded recordings for comparison');
  };

  const playRecording = (type: 'raw' | 'processed') => {
    if (!lastRecording) return;

    // If already playing this type, just resume
    if (playingType === type && audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        console.log(`[RECORDER_UI] Resuming ${type} recording`);
      }
      return;
    }

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }

    // Create new audio element
    const blob = type === 'raw' ? lastRecording.raw : lastRecording.processed;
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingType(type);
    setCurrentTime(0);
    setDuration(0);
    
    audio.play();
    console.log(`[RECORDER_UI] Playing ${type} recording`);
  };

  const pausePlayback = () => {
    if (audioRef.current && playingType) {
      audioRef.current.pause();
      console.log('[RECORDER_UI] Paused playback');
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingType(null);
    setIsPaused(false);
    setCurrentTime(0);
    console.log('[RECORDER_UI] Stopped playback');
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || !isFinite(duration)) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    if (isFinite(newTime)) {
      seekTo(newTime);
    }
  };

  return (
    <Card className='call-recorder-container'>
      <div className="call-recorder-header">
        <div className="call-recorder-title">
          <h4>🎙️ Call Recorder</h4>
        </div>
        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot"></span>
            <span className="recording-time">{formatDuration(recordingDuration)}</span>
          </div>
        )}
      </div>

      <div className="call-recorder-content">
        <p className="recorder-description">
          Record your microphone audio to compare raw vs Speex-processed audio.
        </p>

        <div className="recorder-controls">
          {!isRecording ? (
            <GuxButton 
              accent="primary" 
              onClick={startRecording}
            >
              ⏺️ Start Recording
            </GuxButton>
          ) : (
            <GuxButton 
              accent="danger" 
              onClick={stopRecording}
            >
              ⏹️ Stop Recording
            </GuxButton>
          )}
        </div>

        {hasRecording && lastRecording && (
          <div className="recording-results">
            <h5>Recording Complete</h5>
            
            <div className="recording-metadata">
              <div className="metadata-item">
                <span className="metadata-label">Duration:</span>
                <span className="metadata-value">
                  {formatDuration(Math.floor((lastRecording.metadata.duration || 0) / 1000))}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Speex:</span>
                <span className={`metadata-value ${lastRecording.metadata.speexEnabled ? 'enabled' : 'disabled'}`}>
                  {lastRecording.metadata.speexEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Browser NS:</span>
                <span className={`metadata-value ${lastRecording.metadata.browserNSEnabled ? 'enabled' : 'disabled'}`}>
                  {lastRecording.metadata.browserNSEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Sample Rate:</span>
                <span className="metadata-value">
                  {lastRecording.metadata.sampleRate} Hz
                </span>
              </div>
            </div>

            <div className="playback-controls">
              <div className="playback-section">
                <h6>Raw Audio (Before Processing)</h6>
                <div className="playback-buttons">
                  {playingType !== 'raw' ? (
                    <GuxButton onClick={() => playRecording('raw')}>
                      ▶️ Play Raw
                    </GuxButton>
                  ) : (
                    <>
                      {!isPaused ? (
                        <GuxButton onClick={pausePlayback}>
                          ⏸️ Pause
                        </GuxButton>
                      ) : (
                        <GuxButton onClick={() => playRecording('raw')}>
                          ▶️ Resume
                        </GuxButton>
                      )}
                      <GuxButton onClick={stopPlayback}>
                        ⏹️ Stop
                      </GuxButton>
                    </>
                  )}
                </div>
                {playingType === 'raw' && (
                  <div className="audio-player">
                    <div className="time-display">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="progress-bar-container" onClick={handleProgressBarClick}>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="playback-section">
                <h6>Processed Audio (After Speex)</h6>
                <div className="playback-buttons">
                  {playingType !== 'processed' ? (
                    <GuxButton onClick={() => playRecording('processed')}>
                      ▶️ Play Processed
                    </GuxButton>
                  ) : (
                    <>
                      {!isPaused ? (
                        <GuxButton onClick={pausePlayback}>
                          ⏸️ Pause
                        </GuxButton>
                      ) : (
                        <GuxButton onClick={() => playRecording('processed')}>
                          ▶️ Resume
                        </GuxButton>
                      )}
                      <GuxButton onClick={stopPlayback}>
                        ⏹️ Stop
                      </GuxButton>
                    </>
                  )}
                </div>
                {playingType === 'processed' && (
                  <div className="audio-player">
                    <div className="time-display">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="progress-bar-container" onClick={handleProgressBarClick}>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="download-section">
              <GuxButton accent="primary" onClick={downloadRecordings}>
                ⬇️ Download All Recordings
              </GuxButton>
              <p className="download-note">
                Downloads 3 files: raw audio, processed audio, and metadata JSON
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

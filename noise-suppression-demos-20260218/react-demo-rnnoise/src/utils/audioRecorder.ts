/**
 * Audio Recorder for comparing raw vs processed audio
 * Records both unprocessed (before RNNoise) and processed (after RNNoise) audio
 */

import { logInfo, logSuccess, logError, logWarn } from './logger';

export interface RecordingMetadata {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  rnnoiseEnabled: boolean;
  browserNSEnabled: boolean;
  sampleRate: number;
}

export class AudioRecorder {
  private rawRecorder: MediaRecorder | null = null;
  private processedRecorder: MediaRecorder | null = null;
  private rawChunks: Blob[] = [];
  private processedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private metadata: RecordingMetadata | null = null;

  async startRecording(
    rawStream: MediaStream,
    processedStream: MediaStream,
    rnnoiseEnabled: boolean,
    browserNSEnabled: boolean
  ): Promise<void> {
    if (this.isRecording) {
      logWarn('RECORDER', 'Already recording');
      return;
    }

    try {
      this.rawChunks = [];
      this.processedChunks = [];

      // Get sample rate from the stream
      const audioTrack = rawStream.getAudioTracks()[0];
      const settings = audioTrack.getSettings();
      const sampleRate = settings.sampleRate || 48000;

      this.metadata = {
        startTime: new Date(),
        rnnoiseEnabled,
        browserNSEnabled,
        sampleRate
      };

      // Create recorder for raw audio
      this.rawRecorder = new MediaRecorder(rawStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.rawRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.rawChunks.push(event.data);
        }
      };

      // Create recorder for processed audio
      this.processedRecorder = new MediaRecorder(processedStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.processedRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.processedChunks.push(event.data);
        }
      };

      // Start both recorders
      this.rawRecorder.start(100); // Collect data every 100ms
      this.processedRecorder.start(100);

      this.isRecording = true;

      logSuccess('RECORDER', 'Started recording both raw and processed audio', {
        rnnoiseEnabled,
        browserNSEnabled,
        sampleRate
      });
    } catch (error) {
      logError('RECORDER', 'Failed to start recording', error);
      throw error;
    }
  }

  stopRecording(): Promise<{ raw: Blob; processed: Blob; metadata: RecordingMetadata }> {
    return new Promise((resolve, reject) => {
      if (!this.isRecording) {
        reject(new Error('Not currently recording'));
        return;
      }

      const rawPromise = new Promise<Blob>((resolveRaw) => {
        if (this.rawRecorder) {
          this.rawRecorder.onstop = () => {
            const blob = new Blob(this.rawChunks, { type: 'audio/webm' });
            resolveRaw(blob);
          };
          this.rawRecorder.stop();
        }
      });

      const processedPromise = new Promise<Blob>((resolveProcessed) => {
        if (this.processedRecorder) {
          this.processedRecorder.onstop = () => {
            const blob = new Blob(this.processedChunks, { type: 'audio/webm' });
            resolveProcessed(blob);
          };
          this.processedRecorder.stop();
        }
      });

      Promise.all([rawPromise, processedPromise])
        .then(([raw, processed]) => {
          this.isRecording = false;

          if (this.metadata) {
            this.metadata.endTime = new Date();
            this.metadata.duration = this.metadata.endTime.getTime() - this.metadata.startTime.getTime();
          }

          logSuccess('RECORDER', 'Stopped recording', {
            rawSize: raw.size,
            processedSize: processed.size,
            duration: this.metadata?.duration
          });

          resolve({
            raw,
            processed,
            metadata: this.metadata!
          });
        })
        .catch(reject);
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  getMetadata(): RecordingMetadata | null {
    return this.metadata;
  }
}

// Singleton instance
let recorderInstance: AudioRecorder | null = null;

export function getAudioRecorder(): AudioRecorder {
  if (!recorderInstance) {
    recorderInstance = new AudioRecorder();
  }
  return recorderInstance;
}

export function downloadRecording(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  
  logInfo('RECORDER', `Downloaded recording: ${filename}`);
}

export function downloadRecordingWithMetadata(
  raw: Blob,
  processed: Blob,
  metadata: RecordingMetadata
): void {
  const timestamp = metadata.startTime.toISOString().replace(/[:.]/g, '-');
  
  // Download raw audio
  downloadRecording(raw, `raw-audio-${timestamp}.webm`);
  
  // Download processed audio
  downloadRecording(processed, `processed-audio-${timestamp}.webm`);
  
  // Download metadata as JSON
  const metadataJson = JSON.stringify(metadata, null, 2);
  const metadataBlob = new Blob([metadataJson], { type: 'application/json' });
  downloadRecording(metadataBlob, `metadata-${timestamp}.json`);
  
  logSuccess('RECORDER', 'Downloaded all recordings and metadata');
}

import { GuxButton } from 'genesys-spark-components-react';
import Card from './Card';
import { logger } from '../utils/logger';
import './DiagnosticExport.css';

export default function DiagnosticExport() {
  const handleExportDiagnostics = async () => {
    try {
      // 1. Get logs
      const logsText = logger.exportLogsAsText();
      
      // 2. Get console output (from logger which captures console)
      const consoleOutput = logger.getLogs()
        .map(log => `[${log.timestamp.toISOString()}] [${log.level}] [${log.category}] ${log.message}${log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''}`)
        .join('\n');
      
      // 3. Create diagnostic bundle
      const diagnosticData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        logs: logsText,
        consoleOutput: consoleOutput,
        audioContext: {
          sampleRate: 48000,
          state: 'running'
        }
      };
      
      // 4. Create and download bundle
      const blob = new Blob([JSON.stringify(diagnosticData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rnnoise-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Also download logs as text for easy reading
      const logsBlob = new Blob([logsText], { type: 'text/plain' });
      const logsUrl = URL.createObjectURL(logsBlob);
      const logsLink = document.createElement('a');
      logsLink.href = logsUrl;
      logsLink.download = `rnnoise-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
      logsLink.click();
      URL.revokeObjectURL(logsUrl);
      
      console.log('✅ Diagnostic bundle exported successfully');
    } catch (error) {
      console.error('❌ Failed to export diagnostics:', error);
    }
  };

  return (
    <Card className='diagnostic-export-container'>
      <div className="diagnostic-export-content">
        <div className="diagnostic-export-info">
          <h4>Diagnostic Export</h4>
          <p>Export logs and console output for debugging. Check browser console for real-time logs.</p>
        </div>
        <GuxButton accent="primary" onClick={handleExportDiagnostics}>
          📦 Export Diagnostics
        </GuxButton>
      </div>
    </Card>
  );
}

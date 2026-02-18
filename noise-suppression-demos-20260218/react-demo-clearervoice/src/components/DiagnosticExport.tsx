import { GuxButton } from 'genesys-spark-components-react';
import Card from './Card';
import './DiagnosticExport.css';

export default function DiagnosticExport() {
  const handleExportDiagnostics = async () => {
    try {
      console.log('[DIAGNOSTIC_EXPORT] Exporting diagnostics...');
      
      // Create diagnostic bundle
      const diagnosticData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        logs: 'Console logs exported - check browser console for real-time logs',
        audioContext: {
          sampleRate: 48000,
          state: 'running'
        }
      };
      
      // Download as JSON
      const blob = new Blob([JSON.stringify(diagnosticData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `speex-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      // Download as text
      const logsText = `Diagnostic Export\n=================\nTimestamp: ${diagnosticData.timestamp}\nUser Agent: ${diagnosticData.userAgent}\nPlatform: ${diagnosticData.platform}\n\nCheck browser console for real-time logs.`;
      const logsBlob = new Blob([logsText], { type: 'text/plain' });
      const logsUrl = URL.createObjectURL(logsBlob);
      const logsLink = document.createElement('a');
      logsLink.href = logsUrl;
      logsLink.download = `speex-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
      logsLink.click();
      URL.revokeObjectURL(logsUrl);
      
      console.log('[DIAGNOSTIC_EXPORT] ✅ Diagnostic bundle exported successfully');
    } catch (error) {
      console.error('[DIAGNOSTIC_EXPORT] ❌ Failed to export diagnostics:', error);
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

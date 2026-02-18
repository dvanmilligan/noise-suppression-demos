import { useState, useEffect, useRef } from 'react';
import './LogViewer.css';
import { GuxButton } from 'genesys-spark-components-react';
import Card from './Card';
import { logger, LogEntry, LogLevel } from '../utils/logger';

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pausedLogsRef = useRef<LogEntry[]>([]);

  useEffect(() => {
    // Subscribe to logger
    const unsubscribe = logger.subscribe((entry) => {
      if (!isPaused) {
        setLogs(prev => [...prev, entry]);
      } else {
        pausedLogsRef.current.push(entry);
      }
    });

    // Load existing logs
    setLogs(logger.getLogs());

    return unsubscribe;
  }, [isPaused]);

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive (if not paused)
    if (!isPaused && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const handlePauseToggle = () => {
    if (isPaused) {
      // Resume: add paused logs
      setLogs(prev => [...prev, ...pausedLogsRef.current]);
      pausedLogsRef.current = [];
    }
    setIsPaused(!isPaused);
  };

  const handleClear = () => {
    setLogs([]);
    pausedLogsRef.current = [];
    logger.clear();
  };

  const handleExport = () => {
    const text = logger.exportLogsAsText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webrtc-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLogLevelClass = (level: LogLevel): string => {
    switch (level) {
      case LogLevel.ERROR: return 'log-error';
      case LogLevel.WARN: return 'log-warn';
      case LogLevel.SUCCESS: return 'log-success';
      case LogLevel.DEBUG: return 'log-debug';
      default: return 'log-info';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (filterCategory !== 'ALL' && log.category !== filterCategory) return false;
    return true;
  });

  const categories = ['ALL', ...Array.from(new Set(logs.map(log => log.category)))];

  return (
    <Card className='log-viewer-container'>
      <div className="log-viewer-header">
        <div className="log-viewer-title">
          <h4>Live Logs</h4>
          <span className="log-count">
            {filteredLogs.length} {isPaused && `(${pausedLogsRef.current.length} paused)`}
          </span>
        </div>
        <div className="log-viewer-controls">
          <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value)}
            className="log-filter"
          >
            <option value="ALL">All Levels</option>
            <option value={LogLevel.DEBUG}>Debug</option>
            <option value={LogLevel.INFO}>Info</option>
            <option value={LogLevel.SUCCESS}>Success</option>
            <option value={LogLevel.WARN}>Warning</option>
            <option value={LogLevel.ERROR}>Error</option>
          </select>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="log-filter"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <GuxButton 
            accent={isPaused ? 'primary' : 'secondary'}
            onClick={handlePauseToggle}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </GuxButton>
          <GuxButton onClick={handleClear}>
            🗑️ Clear
          </GuxButton>
          <GuxButton onClick={handleExport}>
            ⬇️ Export
          </GuxButton>
          <GuxButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▲ Collapse' : '▼ Expand'}
          </GuxButton>
        </div>
      </div>
      
      {isExpanded && (
        <div className="log-viewer-content">
          <div className="log-entries">
            {filteredLogs.length === 0 ? (
              <div className="log-empty">No logs to display</div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className={`log-entry ${getLogLevelClass(log.level)}`}>
                  <span className="log-time">
                    {log.timestamp.toLocaleTimeString()}.{log.timestamp.getMilliseconds().toString().padStart(3, '0')}
                  </span>
                  <span className={`log-level log-level-${log.level.toLowerCase()}`}>
                    {log.level}
                  </span>
                  <span className="log-category">[{log.category}]</span>
                  <span className="log-message">{log.message}</span>
                  {log.data && (
                    <div className="log-data">
                      {typeof log.data === 'object' 
                        ? JSON.stringify(log.data, null, 2)
                        : String(log.data)
                      }
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </Card>
  );
}

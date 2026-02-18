/**
 * Centralized logging system for the demo app
 * Captures all logs for display in the UI
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

type LogListener = (entry: LogEntry) => void;

class Logger {
  private logs: LogEntry[] = [];
  private listeners: LogListener[] = [];
  private maxLogs = 1000;

  log(level: LogLevel, category: string, message: string, data?: any) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      level,
      category,
      message,
      data
    };

    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(entry));

    // Also log to console with appropriate method
    const consoleMessage = `[${category}] ${message}`;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(consoleMessage, data);
        break;
      case LogLevel.INFO:
      case LogLevel.SUCCESS:
        console.info(consoleMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(consoleMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(consoleMessage, data);
        break;
    }
  }

  debug(category: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: string, message: string, data?: any) {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log(LogLevel.WARN, category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.log(LogLevel.ERROR, category, message, data);
  }

  success(category: string, message: string, data?: any) {
    this.log(LogLevel.SUCCESS, category, message, data);
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.listeners.forEach(listener => 
      listener({
        id: 'clear',
        timestamp: new Date(),
        level: LogLevel.INFO,
        category: 'SYSTEM',
        message: 'Logs cleared'
      })
    );
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  exportLogsAsText(): string {
    return this.logs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level}] [${log.category}] ${log.message}${log.data ? '\n  Data: ' + JSON.stringify(log.data) : ''}`
    ).join('\n');
  }
}

// Singleton instance
export const logger = new Logger();

// Convenience exports
export const logDebug = (category: string, message: string, data?: any) => 
  logger.debug(category, message, data);

export const logInfo = (category: string, message: string, data?: any) => 
  logger.info(category, message, data);

export const logWarn = (category: string, message: string, data?: any) => 
  logger.warn(category, message, data);

export const logError = (category: string, message: string, data?: any) => 
  logger.error(category, message, data);

export const logSuccess = (category: string, message: string, data?: any) => 
  logger.success(category, message, data);

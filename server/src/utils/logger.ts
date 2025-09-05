type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private log(level: LogLevel, message: string, context?: any): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    // In development, use console for better formatting
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(`[${logEntry.timestamp}] ERROR:`, message, context || '');
          break;
        case 'warn':
          console.warn(`[${logEntry.timestamp}] WARN:`, message, context || '');
          break;
        case 'debug':
          console.debug(`[${logEntry.timestamp}] DEBUG:`, message, context || '');
          break;
        default:
          console.log(`[${logEntry.timestamp}] INFO:`, message, context || '');
      }
    } else {
      // In production, you could send logs to external service
      // For now, we'll suppress most logs except errors
      if (level === 'error') {
        console.error(JSON.stringify(logEntry));
      }
    }
  }

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: any): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();

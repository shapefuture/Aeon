/**
 * Logger utility for consistent logging across the application
 * Supports different log levels and environments
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

// Default to INFO in production, DEBUG in development
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG

interface LoggerOptions {
  namespace?: string
  level?: LogLevel
}

class Logger {
  private namespace: string
  private level: LogLevel

  constructor(options: LoggerOptions = {}) {
    this.namespace = options.namespace || 'app'
    this.level = options.level !== undefined ? options.level : DEFAULT_LOG_LEVEL
  }

  /**
   * Format log message with timestamp and namespace
   */
  private formatMessage(message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${this.namespace}] ${message}`
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(this.formatMessage(message), ...args)
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(this.formatMessage(message), ...args)
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage(message), ...args)
    }
  }

  /**
   * Log error message
   */
  error(message: string | Error, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      const errorMessage =
        message instanceof Error ? `${message.name}: ${message.message}` : message
      console.error(this.formatMessage(errorMessage), ...args)

      // Log stack trace for Error objects
      if (message instanceof Error && message.stack) {
        console.error(this.formatMessage(`Stack trace: ${message.stack}`))
      }
    }
  }

  /**
   * Create a child logger with a new namespace
   */
  child(namespace: string): Logger {
    return new Logger({
      namespace: `${this.namespace}:${namespace}`,
      level: this.level,
    })
  }

  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.level = level
  }
}

/**
 * Create a new logger instance
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger(options)
}

// Default logger instance
export const logger = createLogger()

import { logger, createLogger, LogLevel } from '@/lib/logger'

describe('Logger', () => {
  let consoleDebugSpy: jest.SpyInstance
  let consoleInfoSpy: jest.SpyInstance
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    // Mock console methods
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation()
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    // Restore console methods
    consoleDebugSpy.mockRestore()
    consoleInfoSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('should create a default logger', () => {
    expect(logger).toBeDefined()
  })

  it('should create a custom logger with namespace', () => {
    const customLogger = createLogger({ namespace: 'test' })
    expect(customLogger).toBeDefined()
  })

  it('should log debug messages', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.DEBUG })
    testLogger.debug('Debug message')
    expect(consoleDebugSpy).toHaveBeenCalled()
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('[test]')
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('Debug message')
  })

  it('should log info messages', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.INFO })
    testLogger.info('Info message')
    expect(consoleInfoSpy).toHaveBeenCalled()
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('[test]')
    expect(consoleInfoSpy.mock.calls[0][0]).toContain('Info message')
  })

  it('should log warning messages', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.WARN })
    testLogger.warn('Warning message')
    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('[test]')
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('Warning message')
  })

  it('should log error messages', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.ERROR })
    testLogger.error('Error message')
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('[test]')
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error message')
  })

  it('should log error objects with stack trace', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.ERROR })
    const error = new Error('Test error')
    testLogger.error(error)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2) // Once for the error message, once for the stack trace
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error: Test error')
    expect(consoleErrorSpy.mock.calls[1][0]).toContain('Stack trace:')
  })

  it('should respect log level hierarchy', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.WARN })
    
    testLogger.debug('Debug message')
    testLogger.info('Info message')
    testLogger.warn('Warning message')
    testLogger.error('Error message')
    
    expect(consoleDebugSpy).not.toHaveBeenCalled()
    expect(consoleInfoSpy).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('should create child loggers with proper namespace', () => {
    const parentLogger = createLogger({ namespace: 'parent', level: LogLevel.DEBUG })
    const childLogger = parentLogger.child('child')
    
    childLogger.debug('Child debug message')
    
    expect(consoleDebugSpy).toHaveBeenCalled()
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('[parent:child]')
  })

  it('should allow changing log level dynamically', () => {
    const testLogger = createLogger({ namespace: 'test', level: LogLevel.INFO })
    
    testLogger.debug('Debug message 1') // Should not log
    expect(consoleDebugSpy).not.toHaveBeenCalled()
    
    testLogger.setLevel(LogLevel.DEBUG)
    testLogger.debug('Debug message 2') // Should log
    expect(consoleDebugSpy).toHaveBeenCalled()
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('Debug message 2')
  })
})

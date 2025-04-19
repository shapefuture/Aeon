/**
 * Error handling utilities for the application
 */
import { logger } from './logger'

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    options: { code?: string; statusCode?: number; context?: Record<string, any> } = {}
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = options.code || 'APP_ERROR'
    this.statusCode = options.statusCode || 500
    this.context = options.context

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * API error class for handling API-related errors
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    options: { code?: string; statusCode?: number; context?: Record<string, any> } = {}
  ) {
    super(message, {
      code: options.code || 'API_ERROR',
      statusCode: options.statusCode || 500,
      context: options.context,
    })
  }
}

/**
 * Validation error class for handling validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string, options: { code?: string; context?: Record<string, any> } = {}) {
    super(message, {
      code: options.code || 'VALIDATION_ERROR',
      statusCode: 400,
      context: options.context,
    })
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends AppError {
  constructor(message: string, options: { code?: string; context?: Record<string, any> } = {}) {
    super(message, {
      code: options.code || 'NOT_FOUND',
      statusCode: 404,
      context: options.context,
    })
  }
}

/**
 * Unauthorized error class
 */
export class UnauthorizedError extends AppError {
  constructor(message: string, options: { code?: string; context?: Record<string, any> } = {}) {
    super(message, {
      code: options.code || 'UNAUTHORIZED',
      statusCode: 401,
      context: options.context,
    })
  }
}

/**
 * Safely execute a function and handle any errors
 * @param fn Function to execute
 * @param errorHandler Optional custom error handler
 * @returns Result of the function or undefined if an error occurred
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: Error) => T | null
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error instanceof Error ? error : new Error(String(error)))
    } else {
      logger.error('Unhandled error:', error)
      throw error
    }
  }
}

/**
 * Safely execute a function and handle any errors (synchronous version)
 * @param fn Function to execute
 * @param errorHandler Optional custom error handler
 * @returns Result of the function or undefined if an error occurred
 */
export function tryCatchSync<T>(fn: () => T, errorHandler?: (error: Error) => T | null): T | null {
  try {
    return fn()
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error instanceof Error ? error : new Error(String(error)))
    } else {
      logger.error('Unhandled error:', error)
      throw error
    }
  }
}

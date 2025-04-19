import { 
  AppError, 
  ApiError, 
  ValidationError, 
  NotFoundError, 
  UnauthorizedError,
  tryCatch,
  tryCatchSync
} from '@/lib/errors'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

describe('Error Classes', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.name).toBe('AppError')
    expect(error.code).toBe('APP_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.context).toBeUndefined()
  })

  it('should create an AppError with custom values', () => {
    const error = new AppError('Test error', { 
      code: 'CUSTOM_ERROR', 
      statusCode: 400, 
      context: { foo: 'bar' } 
    })
    expect(error.message).toBe('Test error')
    expect(error.name).toBe('AppError')
    expect(error.code).toBe('CUSTOM_ERROR')
    expect(error.statusCode).toBe(400)
    expect(error.context).toEqual({ foo: 'bar' })
  })

  it('should create an ApiError with default values', () => {
    const error = new ApiError('API error')
    expect(error.message).toBe('API error')
    expect(error.name).toBe('ApiError')
    expect(error.code).toBe('API_ERROR')
    expect(error.statusCode).toBe(500)
  })

  it('should create a ValidationError with default values', () => {
    const error = new ValidationError('Validation error')
    expect(error.message).toBe('Validation error')
    expect(error.name).toBe('ValidationError')
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.statusCode).toBe(400)
  })

  it('should create a NotFoundError with default values', () => {
    const error = new NotFoundError('Not found error')
    expect(error.message).toBe('Not found error')
    expect(error.name).toBe('NotFoundError')
    expect(error.code).toBe('NOT_FOUND')
    expect(error.statusCode).toBe(404)
  })

  it('should create an UnauthorizedError with default values', () => {
    const error = new UnauthorizedError('Unauthorized error')
    expect(error.message).toBe('Unauthorized error')
    expect(error.name).toBe('UnauthorizedError')
    expect(error.code).toBe('UNAUTHORIZED')
    expect(error.statusCode).toBe(401)
  })
})

describe('tryCatch', () => {
  it('should return the result of the function if it succeeds', async () => {
    const fn = jest.fn().mockResolvedValue('success')
    const result = await tryCatch(fn)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalled()
  })

  it('should return undefined if the function throws an error', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Test error'))
    const result = await tryCatch(fn)
    expect(result).toBeUndefined()
    expect(fn).toHaveBeenCalled()
  })

  it('should call the error handler if provided', async () => {
    const error = new Error('Test error')
    const fn = jest.fn().mockRejectedValue(error)
    const errorHandler = jest.fn()
    
    await tryCatch(fn, errorHandler)
    
    expect(errorHandler).toHaveBeenCalledWith(error)
  })
})

describe('tryCatchSync', () => {
  it('should return the result of the function if it succeeds', () => {
    const fn = jest.fn().mockReturnValue('success')
    const result = tryCatchSync(fn)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalled()
  })

  it('should return undefined if the function throws an error', () => {
    const fn = jest.fn().mockImplementation(() => {
      throw new Error('Test error')
    })
    const result = tryCatchSync(fn)
    expect(result).toBeUndefined()
    expect(fn).toHaveBeenCalled()
  })

  it('should call the error handler if provided', () => {
    const error = new Error('Test error')
    const fn = jest.fn().mockImplementation(() => {
      throw error
    })
    const errorHandler = jest.fn()
    
    tryCatchSync(fn, errorHandler)
    
    expect(errorHandler).toHaveBeenCalledWith(error)
  })
})

import { renderHook, act } from '@testing-library/react'
import { useFormSubmit } from '@/hooks/use-form-submit'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    })
  }
}))

describe('useFormSubmit', () => {
  it('should initialize with default state', () => {
    const submitFn = jest.fn()
    const { result } = renderHook(() => useFormSubmit(submitFn))
    
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()
  })
  
  it('should handle successful submission', async () => {
    const mockData = { id: 1, name: 'Test' }
    const submitFn = jest.fn().mockResolvedValue(mockData)
    const onSuccess = jest.fn()
    
    const { result } = renderHook(() => 
      useFormSubmit(submitFn, { onSuccess })
    )
    
    await act(async () => {
      await result.current.submit({ name: 'Test' })
    })
    
    expect(submitFn).toHaveBeenCalledWith({ name: 'Test' })
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual(mockData)
    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })
  
  it('should handle submission error', async () => {
    const error = new Error('Submission failed')
    const submitFn = jest.fn().mockRejectedValue(error)
    const onError = jest.fn()
    
    const { result } = renderHook(() => 
      useFormSubmit(submitFn, { onError })
    )
    
    await act(async () => {
      await result.current.submit({ name: 'Test' })
    })
    
    expect(submitFn).toHaveBeenCalledWith({ name: 'Test' })
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toEqual(error)
    expect(result.current.data).toBeNull()
    expect(onError).toHaveBeenCalledWith(error)
  })
  
  it('should reset state when reset is called', async () => {
    const mockData = { id: 1, name: 'Test' }
    const submitFn = jest.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useFormSubmit(submitFn))
    
    await act(async () => {
      await result.current.submit({ name: 'Test' })
    })
    
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data).toEqual(mockData)
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.data).toBeNull()
  })
  
  it('should set isSubmitting to true during submission', async () => {
    // Create a promise that we can resolve manually
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    const submitFn = jest.fn().mockReturnValue(promise)
    
    const { result } = renderHook(() => useFormSubmit(submitFn))
    
    let submissionPromise: Promise<any>
    
    act(() => {
      submissionPromise = result.current.submit({ name: 'Test' })
    })
    
    // Check that isSubmitting is true during submission
    expect(result.current.isSubmitting).toBe(true)
    
    // Resolve the promise
    await act(async () => {
      resolvePromise({ id: 1, name: 'Test' })
      await submissionPromise
    })
    
    // Check that isSubmitting is false after submission
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isSuccess).toBe(true)
  })
})

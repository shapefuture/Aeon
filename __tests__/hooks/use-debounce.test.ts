import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/use-debounce'

// Mock timers
jest.useFakeTimers()

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })
  
  it('should not update the value before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )
    
    // Change the value
    rerender({ value: 'updated', delay: 500 })
    
    // Value should still be the initial value
    expect(result.current).toBe('initial')
    
    // Fast-forward time but not enough to trigger the update
    act(() => {
      jest.advanceTimersByTime(300)
    })
    
    // Value should still be the initial value
    expect(result.current).toBe('initial')
  })
  
  it('should update the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )
    
    // Change the value
    rerender({ value: 'updated', delay: 500 })
    
    // Fast-forward time to trigger the update
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Value should be updated
    expect(result.current).toBe('updated')
  })
  
  it('should reset the timer when the value changes before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )
    
    // Change the value
    rerender({ value: 'updated1', delay: 500 })
    
    // Fast-forward time but not enough to trigger the update
    act(() => {
      jest.advanceTimersByTime(300)
    })
    
    // Change the value again
    rerender({ value: 'updated2', delay: 500 })
    
    // Fast-forward time but not enough to trigger the update for the second change
    act(() => {
      jest.advanceTimersByTime(300)
    })
    
    // Value should still be the initial value
    expect(result.current).toBe('initial')
    
    // Fast-forward time to trigger the update for the second change
    act(() => {
      jest.advanceTimersByTime(200)
    })
    
    // Value should be updated to the second change
    expect(result.current).toBe('updated2')
  })
  
  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )
    
    // Change the value and delay
    rerender({ value: 'updated', delay: 1000 })
    
    // Fast-forward time but not enough to trigger the update
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Value should still be the initial value
    expect(result.current).toBe('initial')
    
    // Fast-forward time to trigger the update
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Value should be updated
    expect(result.current).toBe('updated')
  })
})

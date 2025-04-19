import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary, withErrorBoundary } from '@/components/error-boundary'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

// Component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error')
  return <div>This should not render</div>
}

// Component that doesn't throw an error
const SafeComponent = () => {
  return <div>Safe component</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error during tests
  const originalConsoleError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  
  afterAll(() => {
    console.error = originalConsoleError
  })
  
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Safe component')).toBeInTheDocument()
  })
  
  it('should render fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
  
  it('should render custom fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary
        fallback={(error) => (
          <div>Error: {error.message}</div>
        )}
      >
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })
  
  it('should call onError when an error occurs', () => {
    const onError = jest.fn()
    
    render(
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={onError}
      >
        <ErrorComponent />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(onError.mock.calls[0][0].message).toBe('Test error')
  })
})

describe('withErrorBoundary', () => {
  it('should wrap a component with an error boundary', () => {
    const WrappedSafeComponent = withErrorBoundary(SafeComponent)
    
    render(<WrappedSafeComponent />)
    
    expect(screen.getByText('Safe component')).toBeInTheDocument()
  })
  
  it('should render fallback UI when wrapped component throws', () => {
    const WrappedErrorComponent = withErrorBoundary(ErrorComponent, {
      fallback: <div>HOC fallback</div>
    })
    
    render(<WrappedErrorComponent />)
    
    expect(screen.getByText('HOC fallback')).toBeInTheDocument()
  })
})

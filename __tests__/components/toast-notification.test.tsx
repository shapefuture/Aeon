import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Toast, useToast } from '@/components/ui/toast-notification'

// Mock timers
jest.useFakeTimers()

describe('Toast', () => {
  it('should render with default props', () => {
    render(<Toast message="Test message" />)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })
  
  it('should render with different types', () => {
    const { rerender } = render(<Toast message="Success" type="success" />)
    const successToast = screen.getByRole('alert')
    expect(successToast).toHaveClass('bg-green-500')
    
    rerender(<Toast message="Error" type="error" />)
    const errorToast = screen.getByRole('alert')
    expect(errorToast).toHaveClass('bg-red-500')
    
    rerender(<Toast message="Warning" type="warning" />)
    const warningToast = screen.getByRole('alert')
    expect(warningToast).toHaveClass('bg-yellow-500')
    
    rerender(<Toast message="Info" type="info" />)
    const infoToast = screen.getByRole('alert')
    expect(infoToast).toHaveClass('bg-blue-500')
  })
  
  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<Toast message="Test message" onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })
  
  it('should auto-close after duration', () => {
    const onClose = jest.fn()
    render(<Toast message="Test message" duration={1000} onClose={onClose} />)
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    expect(onClose).toHaveBeenCalled()
  })
  
  it('should not auto-close if duration is 0', () => {
    const onClose = jest.fn()
    render(<Toast message="Test message" duration={0} onClose={onClose} />)
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    expect(onClose).not.toHaveBeenCalled()
  })
})

// Test component that uses the useToast hook
const TestComponent = () => {
  const { showToast, ToastList } = useToast()
  
  return (
    <div>
      <button onClick={() => showToast({ message: 'Success toast', type: 'success' })}>
        Show Success
      </button>
      <button onClick={() => showToast({ message: 'Error toast', type: 'error' })}>
        Show Error
      </button>
      <ToastList />
    </div>
  )
}

describe('useToast', () => {
  it('should show a toast when showToast is called', () => {
    render(<TestComponent />)
    
    const successButton = screen.getByText('Show Success')
    fireEvent.click(successButton)
    
    expect(screen.getByText('Success toast')).toBeInTheDocument()
  })
  
  it('should show multiple toasts', () => {
    render(<TestComponent />)
    
    const successButton = screen.getByText('Show Success')
    const errorButton = screen.getByText('Show Error')
    
    fireEvent.click(successButton)
    fireEvent.click(errorButton)
    
    expect(screen.getByText('Success toast')).toBeInTheDocument()
    expect(screen.getByText('Error toast')).toBeInTheDocument()
  })
  
  it('should remove a toast when it is closed', () => {
    render(<TestComponent />)
    
    const successButton = screen.getByText('Show Success')
    fireEvent.click(successButton)
    
    const toast = screen.getByText('Success toast')
    expect(toast).toBeInTheDocument()
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(screen.queryByText('Success toast')).not.toBeInTheDocument()
  })
})

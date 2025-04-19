'use client'

import { useEffect, useState, useCallback } from 'react'
import { X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

/**
 * Toast notification component for displaying messages
 */
export function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Set background color based on type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
      default:
        return 'bg-blue-500'
    }
  }

  // Close the toast
  const handleClose = useCallback(() => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }, [onClose])

  // Auto-close after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [duration, handleClose])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded shadow-lg text-white ${getBgColor()} transition-opacity duration-300 flex items-center gap-2 max-w-md`}
      role="alert"
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={handleClose}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  children: React.ReactNode
}

/**
 * Container for multiple toast notifications
 */
export function ToastContainer({ children }: ToastContainerProps) {
  return <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">{children}</div>
}

// Interface for toast context if needed in the future
// interface ToastContextType {
//   showToast: (props: Omit<ToastProps, 'onClose'>) => void
//   hideToast: (id: string) => void
// }

/**
 * Hook for using toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...props, id, onClose: () => hideToast(id) }])
    return id
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastList = () => (
    <ToastContainer>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContainer>
  )

  return { showToast, hideToast, ToastList }
}

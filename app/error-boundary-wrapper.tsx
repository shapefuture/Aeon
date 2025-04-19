'use client'

import React from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { logger } from '@/lib/logger'

// Logger instance for the error boundary wrapper
const wrapperLogger = logger.child('ErrorBoundaryWrapper')

/**
 * Client component wrapper for ErrorBoundary
 */
export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl mb-4">Something went wrong</h1>
            <p className="mb-6">
              The application encountered a critical error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
      onError={error => {
        wrapperLogger.error('Critical application error:', error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

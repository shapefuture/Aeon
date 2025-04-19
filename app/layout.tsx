import type React from 'react'
import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import registerServiceWorker from './pwa-register'
import { logger } from '@/lib/logger'
import { ErrorBoundaryWrapper } from './error-boundary-wrapper'

// Logger instance for the root layout
const layoutLogger = logger.child('RootLayout')

export const metadata: Metadata = {
  title: 'Aeon Website',
  description: 'Aeon Website Description',
  generator: 'v0.dev',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aeon',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

// Register service worker only on the client side
if (typeof window !== 'undefined') {
  try {
    registerServiceWorker()
    layoutLogger.info('Service worker registration initiated')
  } catch (error) {
    layoutLogger.error('Failed to register service worker:', error)
  }
}

/**
 * Root layout component for the entire application
 * Wraps all pages with error boundary and provides global styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* GitHub Pages redirect script */}
        <script src="/gh-pages-redirect.js" defer></script>
      </head>
      <body className="min-h-screen bg-black font-sans antialiased">
        <ErrorBoundaryWrapper>
          {children}
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}

import { logger } from '@/lib/logger'
import { tryCatch } from '@/lib/errors'

/**
 * Register service worker for PWA functionality
 * Handles registration success and failure with proper logging
 */
export default function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    logger.info('Service Worker not supported in this environment')
    return
  }

  const serviceWorkerLogger = logger.child('serviceWorker')

  window.addEventListener('load', async () => {
    await tryCatch(async () => {
      try {
        // Check if service worker is already registered
        const existingRegistration = await navigator.serviceWorker.getRegistration()

        if (existingRegistration) {
          serviceWorkerLogger.info('Service Worker already registered', {
            scope: existingRegistration.scope,
          })
          return existingRegistration
        }

        // Register new service worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        serviceWorkerLogger.info('Service Worker registered successfully', {
          scope: registration.scope,
        })

        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          if (!installingWorker) return

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, notify user
                serviceWorkerLogger.info('New content is available, please refresh')
              } else {
                // Content is cached for offline use
                serviceWorkerLogger.info('Content is cached for offline use')
              }
            }
          }
        }

        return registration
      } catch (error) {
        serviceWorkerLogger.error('Service Worker registration failed', error)
        throw error
      }
    })
  })
}

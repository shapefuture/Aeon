'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

// Logger instance for the NotFound page
const notFoundLogger = logger.child('NotFound')

/**
 * Custom 404 page
 */
export default function NotFound() {
  notFoundLogger.info('404 page rendered')

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="mb-8 text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link href="/" passHref>
          <Button className="px-6 py-3">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

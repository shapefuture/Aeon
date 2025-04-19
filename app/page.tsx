import { AeonLanding } from '../components/aeon-landing'
import { logger } from '@/lib/logger'

// Logger instance for the Home page
const homeLogger = logger.child('HomePage')

/**
 * Home page component that renders the main landing page
 */
export default function Home() {
  // Log page render in development mode only
  if (process.env.NODE_ENV === 'development') {
    homeLogger.debug('Rendering Home page')
  }

  return <AeonLanding />
}

#!/usr/bin/env node

/**
 * Script to run build processes concurrently for improved performance
 */

const { execSync } = require('child_process')
const { logger } = require('../lib/logger')

// Logger instance for the build process
const buildLogger = logger.child('BuildConcurrent')

// Start time
const startTime = Date.now()

try {
  buildLogger.info('Starting concurrent build process...')

  // Run manifest generation
  buildLogger.info('Generating manifest...')
  execSync('node scripts/generate-manifest.js', { stdio: 'inherit' })

  // Run type checking in parallel with build
  buildLogger.info('Running type checking and build concurrently...')
  execSync('concurrently "pnpm run check-types" "next build --no-lint"', { stdio: 'inherit' })

  // Run linting after build
  buildLogger.info('Running linting...')
  execSync('pnpm run lint', { stdio: 'inherit' })

  // Calculate total time
  const endTime = Date.now()
  const totalTime = (endTime - startTime) / 1000

  buildLogger.info(`Build completed successfully in ${totalTime.toFixed(2)} seconds`)
} catch (error) {
  buildLogger.error('Build failed', error)
  process.exit(1)
}

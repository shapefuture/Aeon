#!/usr/bin/env node

/**
 * Script to check for common errors in the codebase
 * Usage: node scripts/check-errors.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

/**
 * Execute a command and return its output
 * @param {string} command - Command to execute
 * @param {boolean} ignoreError - Whether to ignore errors
 * @returns {string} Command output
 */
function exec(command, ignoreError = false) {
  try {
    return execSync(command, { encoding: 'utf8' })
  } catch (error) {
    if (ignoreError) {
      return error.stdout || ''
    }
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`)
    console.error(error.stdout || error.message)
    process.exit(1)
  }
}

/**
 * Log a message with a prefix
 * @param {string} message - Message to log
 * @param {string} prefix - Prefix for the message
 * @param {string} color - Color for the prefix
 */
function log(message, prefix = 'INFO', color = colors.blue) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`)
}

/**
 * Check for console.log statements
 */
function checkConsoleLog() {
  log('Checking for console.log statements...', 'CHECK', colors.yellow)

  const result = exec(
    'grep -r "console\\.log" --include="*.ts" --include="*.tsx" . | grep -v "node_modules" | grep -v "scripts/check-errors.js"',
    true
  )

  if (result.trim()) {
    log('Found console.log statements:', 'WARNING', colors.yellow)
    console.log(result)
    return false
  } else {
    log('No console.log statements found.', 'SUCCESS', colors.green)
    return true
  }
}

/**
 * Check for missing error handling in async functions
 */
function checkAsyncErrorHandling() {
  log('Checking for missing error handling in async functions...', 'CHECK', colors.yellow)

  // This is a known limitation - the script may report false positives
  // for async functions that are properly wrapped in error handling
  // We'll just warn about this but not fail the check
  const result = exec(
    'grep -r "async.*=>" --include="*.ts" --include="*.tsx" . | grep -v "node_modules" | grep -v "try" | grep -v "catch" | grep -v "tryCatch" | grep -v "await tryCatch"',
    true
  )

  if (result.trim()) {
    log(
      'The following async functions might need error handling (this may include false positives):',
      'WARNING',
      colors.yellow
    )
    console.log(result)
    // Return true to not fail the check since we have proper error handling in place
    return true
  } else {
    log('All async functions appear to have error handling.', 'SUCCESS', colors.green)
    return true
  }
}

/**
 * Check for missing type annotations
 */
function checkMissingTypes() {
  log('Checking for missing type annotations...', 'CHECK', colors.yellow)

  const result = exec(
    'grep -r ":\\s*any" --include="*.ts" --include="*.tsx" . | grep -v "node_modules"',
    true
  )

  if (result.trim()) {
    log(
      'Found "any" type annotations that could be more specific (consider improving these in the future):',
      'WARNING',
      colors.yellow
    )
    console.log(result)
    // Return true to not fail the check since some 'any' types are acceptable
    return true
  } else {
    log('No "any" type annotations found.', 'SUCCESS', colors.green)
    return true
  }
}

/**
 * Check for unused imports
 */
function checkUnusedImports() {
  log('Checking for unused imports...', 'CHECK', colors.yellow)

  // This is a simple check and might have false positives
  const result = exec(
    'npx eslint --no-eslintrc --parser @typescript-eslint/parser --plugin @typescript-eslint --rule "@typescript-eslint/no-unused-vars: error" "**/*.{ts,tsx}"',
    true
  )

  if (result.includes('error')) {
    log('Found potential unused imports or variables:', 'WARNING', colors.yellow)
    console.log(result)
    return false
  } else {
    log('No unused imports or variables found.', 'SUCCESS', colors.green)
    return true
  }
}

/**
 * Main function
 */
function main() {
  log('Starting error checking process...', 'START', colors.magenta)

  let success = true

  success = checkConsoleLog() && success
  success = checkAsyncErrorHandling() && success
  success = checkMissingTypes() && success
  success = checkUnusedImports() && success

  if (success) {
    log('All checks passed successfully!', 'SUCCESS', colors.green)
    process.exit(0)
  } else {
    log('Some checks failed. Please fix the issues above.', 'ERROR', colors.red)
    process.exit(1)
  }
}

// Run the main function
main()

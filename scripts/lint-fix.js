#!/usr/bin/env node

/**
 * Script to run linting and fix common issues
 * Usage: node scripts/lint-fix.js
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
      return error.stdout
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

// Main script
log('Starting linting and fixing process...', 'START', colors.magenta)

// Step 1: Run ESLint with --fix option
log('Running ESLint with auto-fix...', 'LINT', colors.yellow)
const eslintOutput = exec('npx eslint --fix "**/*.{ts,tsx,js,jsx}"', true)
console.log(eslintOutput)

// Step 2: Run Prettier
log('Running Prettier to format code...', 'FORMAT', colors.cyan)
const prettierOutput = exec('npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"', true)
console.log(prettierOutput)

// Step 3: Run TypeScript type checking
log('Running TypeScript type checking...', 'TYPES', colors.green)
const typeCheckOutput = exec('npx tsc --noEmit', true)
console.log(typeCheckOutput)

log('Linting and fixing process completed!', 'DONE', colors.magenta)

// Check if there are still errors
if (eslintOutput.includes('error') || typeCheckOutput.includes('error')) {
  log('There are still errors that need to be fixed manually.', 'WARNING', colors.red)
  process.exit(1)
}

process.exit(0)

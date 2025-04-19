# Aeon Project

## Overview

Aeon is a private atelier website showcasing bespoke art experiences and symbolic artifacts. The project is built with Next.js, TypeScript, and Three.js for immersive 3D experiences.

## Code Quality Tools

This project includes several tools to ensure code quality:

### Linting and Formatting

- **ESLint**: Checks for code quality issues and enforces coding standards
- **Prettier**: Formats code consistently
- **TypeScript**: Provides static type checking

### Error Handling and Logging

The project includes a robust error handling and logging system:

- **Logger**: A centralized logging utility in `lib/logger.ts`
- **Error Handling**: Custom error classes and utilities in `lib/errors.ts`
- **Error Boundary**: React error boundary component in `components/error-boundary.tsx`
- **Form Validation**: Form validation utilities in `lib/form-validation.ts`
- **Form Submission**: Form submission hook in `hooks/use-form-submit.ts`
- **Toast Notifications**: Toast notification component in `components/ui/toast-notification.tsx`

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in development mode.

### `pnpm build`

Builds the app for production.

### `pnpm lint`

Runs ESLint to check for code quality issues.

### `pnpm lint:fix`

Runs ESLint and automatically fixes issues where possible.

### `pnpm format`

Runs Prettier to format all code files.

### `pnpm check-types`

Runs TypeScript type checking.

### `pnpm fix-all`

Runs all linting, formatting, and type checking tools with automatic fixes where possible.

### `pnpm check-errors`

Checks for common errors in the codebase, such as console.log statements and missing error handling.

### `pnpm validate`

Runs linting, type checking, and error checking in sequence.

### `pnpm prepare-commit`

Prepares code for commit by running fix-all and validate scripts.

## Best Practices

### Logging

Use the logger utility instead of `console.log`:

```typescript
import { logger } from '@/lib/logger'

// Different log levels
logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')

// Create a namespaced logger
const componentLogger = logger.child('ComponentName')
componentLogger.info('Component-specific log')
```

### Error Handling

Use the error handling utilities:

```typescript
import { tryCatch, tryCatchSync, AppError } from '@/lib/errors'

// Async error handling
await tryCatch(async () => {
  // Async code that might throw
})

// Sync error handling
tryCatchSync(() => {
  // Sync code that might throw
})

// Custom errors
throw new AppError('Something went wrong', {
  code: 'CUSTOM_ERROR',
  statusCode: 500,
  context: { additionalInfo: 'value' },
})
```

### React Error Boundaries

Wrap components that might throw errors in an ErrorBoundary:

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={error => {
        logger.error('Component error:', error)
      }}
    >
      <ComponentThatMightThrow />
    </ErrorBoundary>
  )
}
```

Or use the HOC:

```tsx
import { withErrorBoundary } from '@/components/error-boundary'

const SafeComponent = withErrorBoundary(RiskyComponent, {
  fallback: <div>Something went wrong</div>,
})
```

### Form Validation

Use the form validation utilities for handling form submissions:

```typescript
import { validateFormData, contactFormSchema } from '@/lib/form-validation'

// Validate form data
const validatedData = validateFormData(formData, contactFormSchema)
```

### Form Submission

Use the form submission hook for handling form submissions with loading, success, and error states:

```typescript
import { useFormSubmit } from '@/hooks/use-form-submit'
import { submitContactForm } from '@/lib/form-validation'

function ContactForm() {
  const { isSubmitting, isSuccess, error, submit } = useFormSubmit(submitContactForm)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    await submit({
      name: formData.get('name'),
      contact: formData.get('contact'),
      question: formData.get('question')
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {isSuccess && <p>Form submitted successfully!</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  )
}
```

### Toast Notifications

Use the toast notification component for displaying messages:

```typescript
import { useToast } from '@/components/ui/toast-notification'

function MyComponent() {
  const { showToast, ToastList } = useToast()

  const handleClick = () => {
    showToast({
      message: 'Operation successful!',
      type: 'success',
      duration: 3000
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Show Toast</button>
      <ToastList />
    </div>
  )
}
```

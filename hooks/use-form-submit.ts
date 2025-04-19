'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger'
import { tryCatch } from '@/lib/errors'

// Logger instance for form submission hook
const formHookLogger = logger.child('useFormSubmit')

interface FormSubmitOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface FormSubmitState<T> {
  isSubmitting: boolean
  isSuccess: boolean
  error: Error | null
  data: T | null
}

/**
 * Hook for handling form submissions with loading, success, and error states
 * @param submitFn Function that handles the form submission
 * @param options Options for handling success and error cases
 * @returns Form submission state and submit handler
 */
export function useFormSubmit<TData, TInput = TData>(
  submitFn: (data: TInput) => Promise<TData>,
  options: FormSubmitOptions<TData> = {}
) {
  const [state, setState] = useState<FormSubmitState<TData>>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    data: null,
  })

  const submit = async (data: TInput) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
      data: null,
    })

    formHookLogger.debug('Starting form submission')

    try {
      const result = await submitFn(data)

      setState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
        data: result,
      })

      formHookLogger.info('Form submission successful')

      if (options.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      setState({
        isSubmitting: false,
        isSuccess: false,
        error: err,
        data: null,
      })

      formHookLogger.error('Form submission failed', err)

      if (options.onError) {
        options.onError(err)
      }

      return null
    }
  }

  return {
    ...state,
    submit,
    reset: () => {
      setState({
        isSubmitting: false,
        isSuccess: false,
        error: null,
        data: null,
      })
    },
  }
}

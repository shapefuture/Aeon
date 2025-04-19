/**
 * Form validation utilities for handling form submissions safely
 */
import { z } from 'zod'
import { logger } from './logger'
import { ValidationError } from './errors'

// Logger instance for form validation
const formLogger = logger.child('FormValidation')

/**
 * Validate form data against a Zod schema
 * @param data Form data to validate
 * @param schema Zod schema to validate against
 * @returns Validated data or throws ValidationError
 */
export function validateFormData<T extends z.ZodType>(data: unknown, schema: T): z.infer<T> {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }))

      formLogger.warn('Form validation failed', { errors: formattedErrors })

      throw new ValidationError('Form validation failed', {
        code: 'FORM_VALIDATION_ERROR',
        context: { errors: formattedErrors },
      })
    }

    formLogger.error('Unexpected validation error', error)
    throw error
  }
}

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact: z.string().min(1, 'Contact information is required'),
  question: z.string().min(1, 'Question is required'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Handle contact form submission
 * @param formData Form data to submit
 * @returns Promise that resolves when the form is submitted
 */
export async function submitContactForm(formData: ContactFormData): Promise<void> {
  formLogger.info('Submitting contact form', { name: formData.name })

  // Validate the form data
  const validatedData = validateFormData(formData, contactFormSchema)

  try {
    // In a real application, this would send the data to an API
    // For now, we'll just log it
    formLogger.info('Contact form submitted successfully', {
      name: validatedData.name,
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    return Promise.resolve()
  } catch (error) {
    formLogger.error('Failed to submit contact form', error)
    throw error
  }
}

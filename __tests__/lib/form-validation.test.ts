import { validateFormData, contactFormSchema, submitContactForm } from '@/lib/form-validation'
import { ValidationError } from '@/lib/errors'
import { z } from 'zod'

// Mock the logger
jest.mock('@/lib/logger', () => ({
  logger: {
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    })
  }
}))

describe('Form Validation', () => {
  describe('validateFormData', () => {
    it('should validate data against a schema', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number()
      })
      
      const data = { name: 'John', age: 30 }
      const result = validateFormData(data, schema)
      
      expect(result).toEqual(data)
    })
    
    it('should throw ValidationError for invalid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number()
      })
      
      const data = { name: 'John', age: 'thirty' }
      
      expect(() => validateFormData(data, schema)).toThrow(ValidationError)
    })
    
    it('should include validation errors in the context', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().min(18)
      })
      
      const data = { name: 'Jo', age: 16 }
      
      try {
        validateFormData(data, schema)
        fail('Should have thrown ValidationError')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect(error.code).toBe('FORM_VALIDATION_ERROR')
        expect(error.context).toBeDefined()
        expect(error.context.errors).toBeInstanceOf(Array)
        expect(error.context.errors.length).toBe(2)
      }
    })
  })
  
  describe('contactFormSchema', () => {
    it('should validate valid contact form data', () => {
      const data = {
        name: 'John Doe',
        contact: 'john@example.com',
        question: 'How can I use this service?'
      }
      
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
    
    it('should reject invalid contact form data', () => {
      const data = {
        name: '',
        contact: '',
        question: ''
      }
      
      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
  
  describe('submitContactForm', () => {
    it('should submit valid form data', async () => {
      const data = {
        name: 'John Doe',
        contact: 'john@example.com',
        question: 'How can I use this service?'
      }
      
      await expect(submitContactForm(data)).resolves.not.toThrow()
    })
    
    it('should throw for invalid form data', async () => {
      const data = {
        name: '',
        contact: '',
        question: ''
      }
      
      await expect(submitContactForm(data as any)).rejects.toThrow(ValidationError)
    })
  })
})

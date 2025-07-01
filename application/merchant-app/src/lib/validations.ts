import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
  merchantSlug: z.string()
    .min(1, 'Merchant slug is required')
    .regex(/^[a-z0-9-]+$/, 'Merchant slug can only contain lowercase letters, numbers, and hyphens'),
  login: z.string()
    .min(1, 'Login is required')
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
})

// Loyalty Program schemas
export const loyaltyProgramSchema = z.object({
  name: z.string()
    .min(1, 'Program name is required')
    .max(100, 'Program name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  maxPunches: z.number()
    .min(1, 'Must have at least 1 punch')
    .max(50, 'Cannot exceed 50 punches')
    .int('Must be a whole number'),
  rewardDescription: z.string()
    .min(1, 'Reward description is required')
    .max(200, 'Reward description must be less than 200 characters'),
  isActive: z.boolean().default(true),
  termsAndConditions: z.string()
    .max(1000, 'Terms and conditions must be less than 1000 characters')
    .optional()
})

// Design/Style schemas
export const styleCustomizationSchema = z.object({
  primaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  secondaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color')
    .optional(),
  logoFile: z.instanceof(File)
    .refine(file => file.size <= 5000000, 'Logo file must be less than 5MB')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Logo must be JPEG, PNG, or WebP')
    .optional(),
  fontFamily: z.enum(['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat']).optional(),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional()
})

// Merchant onboarding schemas
export const merchantOnboardingSchema = z.object({
  businessName: z.string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be less than 100 characters'),
  businessType: z.enum(['restaurant', 'cafe', 'retail', 'service', 'other']),
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  email: z.string()
    .email('Please enter a valid email address')
    .optional(),
  website: z.string()
    .url('Please enter a valid website URL')
    .optional()
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10000000, 'File must be less than 10MB'),
  allowedTypes: z.array(z.string()).optional()
})

// Form validation helpers
export type LoginFormData = z.infer<typeof loginSchema>
export type LoyaltyProgramFormData = z.infer<typeof loyaltyProgramSchema>
export type StyleCustomizationFormData = z.infer<typeof styleCustomizationSchema>
export type MerchantOnboardingFormData = z.infer<typeof merchantOnboardingSchema>
export type FileUploadFormData = z.infer<typeof fileUploadSchema>

// Validation result types
export type ValidationResult<T> = {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
}

// Helper function to format Zod errors
export const formatZodErrors = (error: z.ZodError): Record<string, string[]> => {
  const formattedErrors: Record<string, string[]> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    if (!formattedErrors[path]) {
      formattedErrors[path] = []
    }
    formattedErrors[path].push(err.message)
  })
  
  return formattedErrors
}

// Helper function to validate data with schema
export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): ValidationResult<T> => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: formatZodErrors(error) 
      }
    }
    return { 
      success: false, 
      errors: { _form: ['Validation failed'] }
    }
  }
} 
import { useForm as useReactHookForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

// Login form hook
export const useLoginForm = (options: {
  onSubmit: (data: { merchantSlug: string; login: string; password: string }) => Promise<void>
  onError?: (errors: any) => void
}) => {
  const loginSchema = z.object({
    merchantSlug: z.string()
      .min(1, 'Merchant slug is required')
      .regex(/^[a-z0-9-]+$/, 'Merchant slug can only contain lowercase letters, numbers, and hyphens'),
    login: z.string().min(1, 'Login is required').trim(),
    password: z.string().min(1, 'Password is required')
  })

  const form = useReactHookForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      merchantSlug: '',
      login: '',
      password: ''
    },
    mode: 'onChange'
  })

  const { handleSubmit, formState } = form
  const { isSubmitting } = formState

  const submitHandler = handleSubmit(
    async (data) => {
      try {
        await options.onSubmit(data)
      } catch (error: any) {
        console.error('Form submission error:', error)
        const message = error.message || 'Login failed. Please check your credentials.'
        toast.error(message)
        options.onError?.(error)
      }
    },
    (errors) => {
      console.log('Form validation errors:', errors)
      options.onError?.(errors)
    }
  )

  return {
    ...form,
    submitHandler,
    isSubmitting
  }
}

// Loyalty program form hook
export const useLoyaltyProgramForm = (options: {
  onSubmit: (data: any) => Promise<void>
  onError?: (errors: any) => void
  defaultValues?: any
  isEdit?: boolean
}) => {
  const loyaltyProgramSchema = z.object({
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

  const form = useReactHookForm({
    resolver: zodResolver(loyaltyProgramSchema),
    defaultValues: options.defaultValues || {
      name: '',
      description: '',
      maxPunches: 10,
      rewardDescription: '',
      isActive: true,
      termsAndConditions: ''
    },
    mode: 'onChange'
  })

  const { handleSubmit, formState } = form
  const { isSubmitting } = formState

  const submitHandler = handleSubmit(
    async (data) => {
      try {
        await options.onSubmit(data)
        const successMessage = options.isEdit ? 'Loyalty program updated successfully!' : 'Loyalty program created successfully!'
        toast.success(successMessage)
      } catch (error: any) {
        console.error('Form submission error:', error)
        const errorMessage = options.isEdit ? 'Failed to update loyalty program' : 'Failed to create loyalty program'
        const message = error.message || errorMessage
        toast.error(message)
        options.onError?.(error)
      }
    },
    (errors) => {
      console.log('Form validation errors:', errors)
      options.onError?.(errors)
    }
  )

  return {
    ...form,
    submitHandler,
    isSubmitting
  }
} 
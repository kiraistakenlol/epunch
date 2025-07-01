import React, { useState } from 'react'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from './FormField'
import { FormActions } from './FormActions'
import { FormErrorDisplay } from './FormErrorDisplay'
import { useLoyaltyProgramForm } from './hooks/useForm'

interface LoyaltyProgramFormProps {
  initialData?: {
    name: string
    description?: string
    maxPunches: number
    rewardDescription: string
    isActive: boolean
    termsAndConditions?: string
  }
  isEdit?: boolean
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
  title?: string
  description?: string
}

export const LoyaltyProgramForm: React.FC<LoyaltyProgramFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  onCancel,
  title,
  description
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useLoyaltyProgramForm({
    defaultValues: initialData,
    isEdit,
    onSubmit: async (data) => {
      setSubmitError(null)
      try {
        await onSubmit(data)
      } catch (err: any) {
        throw new Error(err.message || `Failed to ${isEdit ? 'update' : 'create'} loyalty program`)
      }
    },
    onError: (error) => {
      setSubmitError(error.message || 'Please check your input and try again.')
    }
  })

  const handleDismissError = () => {
    setSubmitError(null)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {title || (isEdit ? 'Edit Loyalty Program' : 'Create Loyalty Program')}
        </CardTitle>
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.submitHandler} className="space-y-6">
            <FormErrorDisplay 
              error={submitError} 
              onDismiss={handleDismissError}
              className="mb-4"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="name"
                label="Program Name"
                placeholder="Enter program name"
                disabled={form.isSubmitting}
                required
                description="A catchy name for your loyalty program"
              />
              
              <FormField
                name="maxPunches"
                label="Maximum Punches"
                type="number"
                placeholder="10"
                disabled={form.isSubmitting}
                required
                description="Number of punches needed to get reward"
              />
            </div>
            
            <FormField
              name="description"
              label="Program Description"
              type="textarea"
              placeholder="Describe your loyalty program..."
              disabled={form.isSubmitting}
              description="Optional description visible to customers"
            />
            
            <FormField
              name="rewardDescription"
              label="Reward Description"
              placeholder="What customers get when they complete the program"
              disabled={form.isSubmitting}
              required
              description="Clearly describe the reward customers will receive"
            />
            
            <FormField
              name="termsAndConditions"
              label="Terms and Conditions"
              type="textarea"
              placeholder="Enter terms and conditions..."
              disabled={form.isSubmitting}
              description="Optional terms and conditions for the program"
            />
            
            <div className="flex items-center space-x-2">
              <FormField
                name="isActive"
                label="Active Program"
                type="switch"
                disabled={form.isSubmitting}
                description="Whether this program is currently active and accepting new members"
              />
            </div>
            
            <FormActions
              submitText={isEdit ? 'Update Program' : 'Create Program'}
              submitingText={isEdit ? 'Updating...' : 'Creating...'}
              onCancel={onCancel}
              isSubmitting={form.isSubmitting}
              isValid={form.formState.isValid}
              showCancelButton={!!onCancel}
              className="pt-6 border-t"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 
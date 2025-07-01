import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  submitText?: string
  submitingText?: string
  cancelText?: string
  isSubmitting?: boolean
  isValid?: boolean
  onCancel?: () => void
  showCancelButton?: boolean
  submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
  disabled?: boolean
}

export const FormActions: React.FC<FormActionsProps> = ({
  submitText = 'Submit',
  submitingText = 'Submitting...',
  cancelText = 'Cancel',
  isSubmitting = false,
  isValid = true,
  onCancel,
  showCancelButton = true,
  submitVariant = 'default',
  cancelVariant = 'outline',
  className,
  disabled = false
}) => {
  return (
    <div className={cn('flex gap-3 justify-end pt-4', className)}>
      {showCancelButton && onCancel && (
        <Button
          type="button"
          variant={cancelVariant}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      )}
      
      <Button
        type="submit"
        variant={submitVariant}
        disabled={disabled || isSubmitting || !isValid}
        className="min-w-[120px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submitingText}
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  )
} 
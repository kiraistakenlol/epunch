import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormErrorDisplayProps {
  error?: string | null
  errors?: string[]
  title?: string
  onDismiss?: () => void
  className?: string
  variant?: 'default' | 'destructive'
}

export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  error,
  errors = [],
  title = 'Error',
  onDismiss,
  className,
  variant = 'destructive'
}) => {
  const hasErrors = error || errors.length > 0
  
  if (!hasErrors) {
    return null
  }

  const allErrors = error ? [error, ...errors] : errors

  return (
    <Alert variant={variant} className={cn('relative', className)}>
      <AlertCircle className="h-4 w-4" />
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {allErrors.length === 1 ? (
          <p>{allErrors[0]}</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 mt-2">
            {allErrors.map((errorMsg, index) => (
              <li key={index}>{errorMsg}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
} 
import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  name: string
  label: string
  description?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'switch'
  options?: { value: string; label: string }[]
  disabled?: boolean
  className?: string
  required?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  placeholder,
  type = 'text',
  options = [],
  disabled = false,
  className,
  required = false
}) => {
  const form = useFormContext()

  const renderInput = (field: any) => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder}
            disabled={disabled}
            className={cn('min-h-[100px]', className)}
            {...field}
          />
        )
      
      case 'select':
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'switch':
        return (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            className={className}
          />
        )
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )
      
      default:
        return (
          <Input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            autoCapitalize={type === 'email' ? 'none' : undefined}
            autoCorrect={type === 'email' ? 'off' : undefined}
            {...field}
          />
        )
    }
  }

  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
            {label}
          </FormLabel>
          <FormControl>
            {renderInput(field)}
          </FormControl>
          {description && (
            <FormDescription>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 
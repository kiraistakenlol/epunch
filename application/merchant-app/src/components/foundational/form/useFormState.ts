import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface UseFormStateReturn<T> {
  formData: T;
  errors: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleFieldChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (field: keyof T) => (value: number | undefined) => void;
  handleSwitchChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateForm: () => boolean;
  validateField: (field: keyof T) => boolean;
  clearFieldError: (field: keyof T) => void;
  resetForm: () => void;
  isValid: boolean;
}

export function useFormState<T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules = {}
): UseFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: keyof T): boolean => {
    const value = formData[field];
    const rule = validationRules[field as string];
    
    if (!rule) return true;

    let error: string | null = null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      error = `${String(field)} is required`;
    }

    // String length validation
    if (!error && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        error = `${String(field)} must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        error = `${String(field)} must be no more than ${rule.maxLength} characters`;
      }
    }

    // Number validation
    if (!error && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        error = `${String(field)} must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && value > rule.max) {
        error = `${String(field)} must be no more than ${rule.max}`;
      }
    }

    // Pattern validation
    if (!error && rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      error = `${String(field)} format is invalid`;
    }

    // Custom validation
    if (!error && rule.custom) {
      error = rule.custom(value);
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error! }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
      return true;
    }
  }, [formData, validationRules]);

  const validateForm = useCallback((): boolean => {
    const fieldNames = Object.keys(validationRules) as (keyof T)[];
    const results = fieldNames.map(field => validateField(field));
    return results.every(result => result);
  }, [validationRules, validateField]);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const handleFieldChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      clearFieldError(field);
    };
  }, [clearFieldError]);

  const handleNumberChange = useCallback((field: keyof T) => {
    return (value: number | undefined) => {
      setFormData(prev => ({ ...prev, [field]: value || 0 }));
      clearFieldError(field);
    };
  }, [clearFieldError]);

  const handleSwitchChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.checked }));
      clearFieldError(field);
    };
  }, [clearFieldError]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const isValid = Object.keys(errors).length === 0;

  return {
    formData,
    errors,
    setFormData,
    setErrors,
    handleFieldChange,
    handleNumberChange,
    handleSwitchChange,
    validateForm,
    validateField,
    clearFieldError,
    resetForm,
    isValid
  };
} 
import React from 'react';
import { EpunchInput, EpunchInputProps } from '../inputs/EpunchInput';
import styles from './FormField.module.css';

export interface FormFieldProps extends Omit<EpunchInputProps, 'label'> {
  label: string;
  error?: boolean;
  helperText?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error = false,
  helperText,
  validation,
  required,
  ...inputProps
}) => {
  const isRequired = required || validation?.required;

  return (
    <div className={styles.formField}>
      <EpunchInput
        label={label}
        required={isRequired}
        {...inputProps}
      />
      
      {(error && helperText) && (
        <div className={styles.errorText}>
          {helperText}
        </div>
      )}
      
      {(!error && helperText) && (
        <div className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
}; 
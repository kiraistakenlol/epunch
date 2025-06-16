import React, { useState } from 'react';
import styles from './EpunchInput.module.css';

export interface EpunchInputProps {
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'off' | 'sentences' | 'words' | 'characters';
  autoCorrect?: 'on' | 'off';
  autoComplete?: string;
  name?: string;
  id?: string;
}

export const EpunchInput: React.FC<EpunchInputProps> = ({
  label,
  multiline = false,
  placeholder,
  value,
  onChange,
  type = 'text',
  rows = 4,
  disabled = false,
  required = false,
  fullWidth = true,
  autoFocus = false,
  autoCapitalize = 'off',
  autoCorrect = 'off',
  autoComplete,
  name,
  id: providedId
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputId = providedId || React.useId();
  
  const baseProps = {
    id: inputId,
    name,
    placeholder,
    value,
    disabled,
    required,
    autoFocus,
    autoCapitalize,
    autoCorrect,
    autoComplete,
    onFocus: handleFocus,
    onBlur: handleBlur,
    className: `${styles.inputField} ${multiline ? styles.multiline : ''} ${required ? styles.required : ''}`
  };

  return (
    <div className={styles.inputContainer} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label 
          htmlFor={inputId}
          className={`${styles.inputLabel} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}
        >
          {label}
          {required && ' *'}
        </label>
      )}
      
      {multiline ? (
        <textarea
          {...baseProps}
          rows={rows}
          onChange={onChange}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          {...baseProps}
          type={type}
          onChange={onChange}
        />
      )}
    </div>
  );
}; 
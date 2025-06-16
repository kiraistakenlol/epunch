import React from 'react';
import { NumericFormat } from 'react-number-format';
import { EpunchInput } from './EpunchInput';

export interface EpunchNumberInputProps {
  value: number | string;
  onValueChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  decimalScale?: number;
  allowNegative?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const EpunchNumberInput: React.FC<EpunchNumberInputProps> = ({
  value,
  onValueChange,
  min,
  max,
  decimalScale = 0,
  allowNegative = false,
  placeholder,
  label,
  required,
  disabled,
  error,
  helperText,
  fullWidth = true,
}) => {
  const handleValueChange = (values: any) => {
    const { floatValue } = values;
    onValueChange(floatValue);
  };

  const isAllowed = (values: any) => {
    const { floatValue } = values;
    if (floatValue === undefined) return true;
    
    if (min !== undefined && floatValue < min) return false;
    if (max !== undefined && floatValue > max) return false;
    
    return true;
  };

  return (
    <NumericFormat
      value={value}
      onValueChange={handleValueChange}
      customInput={EpunchInput}
      allowNegative={allowNegative}
      decimalScale={decimalScale}
      isAllowed={isAllowed}
      placeholder={placeholder}
      label={label}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
    />
  );
}; 
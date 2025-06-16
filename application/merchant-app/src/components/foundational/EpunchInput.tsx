import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { colors, spacing, borderRadius, typography } from '../../theme';

export interface EpunchInputProps extends Omit<TextFieldProps, 'variant' | 'color' | 'sx'> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const EpunchInput: React.FC<EpunchInputProps> = ({
  variant = 'default',
  fullWidth = true,
  multiline = false,
  rows,
  error = false,
  helperText,
  disabled = false,
  ...props
}) => {
  const getVariantStyles = () => {
    const isError = error || variant === 'error';
    
    return {
      '& .MuiOutlinedInput-root': {
        backgroundColor: disabled ? colors.background.variant : '#fff',
        borderRadius: borderRadius.medium,
        fontFamily: typography.fontFamily,
        '& fieldset': {
          borderColor: isError ? colors.error : colors.border.input,
          borderWidth: '1px',
        },
        '&:hover fieldset': {
          borderColor: disabled ? colors.border.input : (isError ? colors.error : colors.primary),
        },
        '&.Mui-focused fieldset': {
          borderColor: isError ? colors.error : colors.primary,
          borderWidth: '2px',
        },
        '&.Mui-disabled': {
          backgroundColor: colors.background.variant,
          '& fieldset': {
            borderColor: colors.border.default,
          },
        },
      },
      '& .MuiInputLabel-root': {
        color: colors.text.secondary,
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.medium,
        '&.Mui-focused': {
          color: isError ? colors.error : colors.primary,
        },
        '&.Mui-error': {
          color: colors.error,
        },
        '&.Mui-disabled': {
          color: colors.text.disabled,
        },
      },
      '& .MuiFormHelperText-root': {
        color: isError ? colors.error : colors.text.disabled,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize.css.xsmall,
        marginTop: spacing.xs / 2,
        marginLeft: 0,
        '&.Mui-error': {
          color: colors.error,
        },
      },
      '& .MuiInputBase-input': {
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize.desktop.body,
        color: colors.text.primary,
        padding: multiline ? spacing.md : `${spacing.md}px ${spacing.md}px`,
        '&::placeholder': {
          color: colors.text.disabled,
          opacity: 1,
        },
        '&.Mui-disabled': {
          color: colors.text.disabled,
        },
      },
    };
  };

  return (
    <TextField
      {...props}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      error={error}
      helperText={helperText}
      disabled={disabled}
      margin="normal"
      sx={{...getVariantStyles(), '& .MuiOutlinedInput-root': {...getVariantStyles()['& .MuiOutlinedInput-root'], border: '2px solid purple !important'}}}
    />
  );
}; 
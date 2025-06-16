import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { colors, spacing, borderRadius, shadows, typography } from '../../theme';

export interface EpunchButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'sx'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const EpunchButton: React.FC<EpunchButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primaryDark,
          color: colors.text.light,
          '&:hover': {
            backgroundColor: disabled ? colors.primaryDark : colors.hover.primary,
          },
          '&:disabled': {
            backgroundColor: colors.state.disabled,
            color: colors.text.light,
          },
        };
      case 'secondary':
        return {
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          border: `1px solid ${colors.border.default}`,
          '&:hover': {
            backgroundColor: disabled ? colors.background.paper : colors.hover.background,
          },
          '&:disabled': {
            backgroundColor: colors.background.paper,
            color: colors.text.disabled,
            borderColor: colors.border.default,
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.border.default}`,
          '&:hover': {
            backgroundColor: disabled ? 'transparent' : colors.hover.background,
            borderColor: disabled ? colors.border.default : colors.primary,
          },
          '&:disabled': {
            color: colors.text.disabled,
            borderColor: colors.border.default,
          },
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          '&:hover': {
            backgroundColor: disabled ? 'transparent' : colors.hover.background,
          },
          '&:disabled': {
            color: colors.text.disabled,
          },
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: `${spacing.xs}px ${spacing.md}px`,
          fontSize: typography.fontSize.css.xsmall,
        };
      case 'large':
        return {
          padding: `${spacing.md}px ${spacing.lg}px`,
          fontSize: typography.fontSize.css.medium,
        };
      default: // medium
        return {
          padding: `${spacing.sm + 4}px ${spacing.lg}px`,
          fontSize: typography.fontSize.css.small,
        };
    }
  };

  const baseStyles = {
    borderRadius: borderRadius.medium,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'none' as const,
    fontFamily: typography.fontFamily,
    boxShadow: variant === 'primary' ? shadows.medium : shadows.none,
    transition: `all 250ms ease`,
    minHeight: size === 'small' ? '32px' : size === 'large' ? '48px' : '40px',
    ...getSizeStyles(),
    ...getVariantStyles(),
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={{...baseStyles, border: '2px solid blue !important'}}
      startIcon={loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : props.startIcon}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}; 
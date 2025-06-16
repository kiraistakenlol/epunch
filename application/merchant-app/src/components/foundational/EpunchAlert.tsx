import React from 'react';
import { Alert, AlertProps } from '@mui/material';
import { colors, borderRadius, spacing, typography } from '../../theme';

export interface EpunchAlertProps extends Omit<AlertProps, 'severity' | 'variant' | 'sx'> {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const EpunchAlert: React.FC<EpunchAlertProps> = ({
  variant = 'info',
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.successBackground,
          border: `1px solid ${colors.successBorder}`,
          color: colors.successDark,
        };
      case 'error':
        return {
          backgroundColor: colors.errorBackground,
          border: `1px solid ${colors.error}`,
          color: colors.error,
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          border: `1px solid ${colors.warning}`,
          color: '#e65100',
        };
      case 'info':
        return {
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          border: `1px solid ${colors.info}`,
          color: '#1565c0',
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    borderRadius: borderRadius.small,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.desktop.body,
    padding: `${spacing.sm + 4}px ${spacing.md}px`,
    marginBottom: spacing.md,
    ...getVariantStyles(),
  };

  return (
    <Alert {...props} severity={variant} sx={{...baseStyles, border: '2px solid yellow !important'}}>
      {children}
    </Alert>
  );
}; 
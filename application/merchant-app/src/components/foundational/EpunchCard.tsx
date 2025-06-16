import React from 'react';
import { Card, CardContent, CardProps } from '@mui/material';
import { colors, borderRadius, shadows, spacing } from '../../theme';

export interface EpunchCardProps extends Omit<CardProps, 'variant' | 'sx'> {
  variant?: 'default' | 'elevated' | 'form';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const EpunchCard: React.FC<EpunchCardProps> = ({
  variant = 'default',
  padding = 'medium',
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.large,
          boxShadow: shadows.heavy,
          border: 'none',
        };
      case 'form':
        return {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.medium,
          boxShadow: shadows.light,
          border: `1px solid ${colors.border.default}`,
        };
      default: // default
        return {
          backgroundColor: colors.background.paper,
          borderRadius: borderRadius.medium,
          boxShadow: shadows.light,
          border: 'none',
        };
    }
  };

  const getPaddingValue = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return spacing.md;
      case 'large':
        return spacing.xl;
      default: // medium
        return spacing.lg;
    }
  };

  const baseStyles = {
    ...getVariantStyles(),
    '& .MuiCardContent-root': {
      padding: getPaddingValue(),
      '&:last-child': {
        paddingBottom: getPaddingValue(),
      },
    },
  };

  return (
    <Card {...props} sx={{...baseStyles, border: '2px solid green !important'}}>
      {padding === 'none' ? (
        children
      ) : (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}; 
import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { colors, typography, shadows } from '../../theme';
import { useMobile } from '../../hooks/useMobile';

export interface EpunchTypographyProps extends Omit<TypographyProps, 'variant' | 'sx'> {
  variant?: 'pageTitle' | 'sectionTitle' | 'cardTitle' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'light' | 'disabled';
  textShadow?: boolean;
  bold?: boolean;
  children: React.ReactNode;
}

export const EpunchTypography: React.FC<EpunchTypographyProps> = ({
  variant = 'body',
  color = 'primary',
  textShadow = false,
  bold = false,
  children,
  ...props
}) => {
  const isMobile = useMobile();

  const getVariantStyles = () => {
    switch (variant) {
      case 'pageTitle':
        return {
          variant: 'h4' as const,
          fontSize: isMobile ? typography.fontSize.mobile.h4 : typography.fontSize.desktop.h4,
          fontWeight: typography.fontWeight.bold,
          textShadow: textShadow ? shadows.text : 'none',
        };
      case 'sectionTitle':
        return {
          variant: 'h6' as const,
          fontSize: isMobile ? typography.fontSize.mobile.h6 : typography.fontSize.desktop.h6,
          fontWeight: typography.fontWeight.bold,
        };
      case 'cardTitle':
        return {
          variant: 'h6' as const,
          fontSize: typography.fontSize.desktop.h6,
          fontWeight: typography.fontWeight.bold,
        };
      case 'body':
        return {
          variant: 'body1' as const,
          fontSize: isMobile ? typography.fontSize.mobile.body : typography.fontSize.desktop.body,
          fontWeight: bold ? typography.fontWeight.bold : typography.fontWeight.normal,
        };
      case 'caption':
        return {
          variant: 'caption' as const,
          fontSize: isMobile ? typography.fontSize.mobile.caption : typography.fontSize.desktop.caption,
        };
      case 'label':
        return {
          variant: 'body2' as const,
          fontSize: typography.fontSize.desktop.body2,
          fontWeight: typography.fontWeight.medium,
        };
      default:
        return {
          variant: 'body1' as const,
        };
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'light':
        return colors.text.light;
      case 'disabled':
        return colors.text.disabled;
      default:
        return colors.text.primary;
    }
  };

  const styles = getVariantStyles();
  
  const baseStyles = {
    color: getColorValue(),
    fontFamily: typography.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    textShadow: styles.textShadow,
  };

  return (
    <Typography {...props} variant={styles.variant} sx={{...baseStyles, border: '1px solid orange', padding: '2px'}}>
      {children}
    </Typography>
  );
}; 
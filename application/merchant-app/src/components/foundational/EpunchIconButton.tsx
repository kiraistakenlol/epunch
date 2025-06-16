import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { colors } from '../../theme/constants';

export interface EpunchIconButtonProps extends IconButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'none';
}

export const EpunchIconButton: React.FC<EpunchIconButtonProps> = ({
  variant = 'neutral',
  size = 'medium',
  position = 'none',
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: colors.text.light,
          '&:hover': {
            backgroundColor: colors.primaryLight,
          },
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: colors.text.light,
          '&:hover': {
            backgroundColor: colors.secondaryLight,
          },
        };
      case 'accent':
        return {
          backgroundColor: colors.secondary,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.secondaryLight,
          },
        };
      default:
        return {
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 28, height: 28 };
      case 'large':
        return { width: 40, height: 40 };
      default:
        return { width: 32, height: 32 };
    }
  };

  const getPositionStyles = (): any => {
    switch (position) {
      case 'top-right':
        return { position: 'absolute' as const, top: -10, right: -10 };
      case 'top-left':
        return { position: 'absolute' as const, top: -10, left: -10 };
      case 'bottom-right':
        return { position: 'absolute' as const, bottom: -10, right: -10 };
      case 'bottom-left':
        return { position: 'absolute' as const, bottom: -10, left: -10 };
      default:
        return {};
    }
  };

  return (
    <IconButton
      {...props}
      sx={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...getPositionStyles(),
        border: '2px solid brown !important',
      }}
    >
      {children}
    </IconButton>
  );
}; 
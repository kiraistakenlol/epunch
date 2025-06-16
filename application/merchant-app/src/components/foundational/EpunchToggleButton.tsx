import React from 'react';
import { ToggleButton, ToggleButtonGroup, ToggleButtonProps, ToggleButtonGroupProps } from '@mui/material';

type ToggleVariant = 'primary' | 'secondary' | 'outlined';
type ToggleSize = 'small' | 'medium' | 'large';

interface EpunchToggleButtonProps extends Omit<ToggleButtonProps, 'sx'> {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

interface EpunchToggleButtonGroupProps extends Omit<ToggleButtonGroupProps, 'sx'> {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

const getButtonStyles = (variant: ToggleVariant, size: ToggleSize) => {
  let baseStyles = {
    borderRadius: '8px',
    textTransform: 'none' as const,
    fontWeight: 'bold',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  };

  let sizeStyles = {};
  switch (size) {
    case 'small':
      sizeStyles = { padding: '4px 8px', fontSize: '0.75rem' };
      break;
    case 'medium':
      sizeStyles = { padding: '8px 16px', fontSize: '0.875rem' };
      break;
    case 'large':
      sizeStyles = { padding: '12px 24px', fontSize: '1rem' };
      break;
  }

  let variantStyles = {};
  switch (variant) {
    case 'primary':
      variantStyles = {
        color: '#3e2723',
        backgroundColor: '#f5f5dc',
        '&:hover': {
          backgroundColor: '#e8e0c7',
        },
        '&.Mui-selected': {
          backgroundColor: '#5d4037',
          color: '#f5f5dc',
          '&:hover': {
            backgroundColor: '#4e342e',
          },
        },
      };
      break;
    case 'secondary':
      variantStyles = {
        color: '#5d4037',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(93, 64, 55, 0.1)',
        },
        '&.Mui-selected': {
          backgroundColor: '#795548',
          color: '#f5f5dc',
          '&:hover': {
            backgroundColor: '#6d4c41',
          },
        },
      };
      break;
    case 'outlined':
    default:
      variantStyles = {
        color: '#3e2723',
        backgroundColor: 'transparent',
        border: '1px solid #5d4037',
        '&:hover': {
          backgroundColor: 'rgba(93, 64, 55, 0.1)',
        },
        '&.Mui-selected': {
          backgroundColor: '#5d4037',
          color: '#f5f5dc',
          '&:hover': {
            backgroundColor: '#4e342e',
          },
        },
      };
      break;
  }

  return {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
  };
};

export const EpunchToggleButton: React.FC<EpunchToggleButtonProps> = ({
  variant = 'outlined',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <ToggleButton
      sx={{
        ...getButtonStyles(variant, size),
        border: '1px solid #8b5a2b',
      }}
      {...props}
    >
      {children}
    </ToggleButton>
  );
};

export const EpunchToggleButtonGroup: React.FC<EpunchToggleButtonGroupProps> = ({
  variant = 'outlined',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <ToggleButtonGroup
      sx={{
        '& .MuiToggleButton-root': {
          ...getButtonStyles(variant, size),
          '&:not(:first-of-type)': {
            borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
          },
          '&:first-of-type': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          },
          '&:last-of-type': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        },
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
      {...props}
    >
      {children}
    </ToggleButtonGroup>
  );
};

export default EpunchToggleButton; 
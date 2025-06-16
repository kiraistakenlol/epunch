import React from 'react';
import { Switch, SwitchProps, FormControlLabel, FormControlLabelProps } from '@mui/material';

type SwitchVariant = 'primary' | 'secondary';
type SwitchSize = 'small' | 'medium';

interface EpunchSwitchProps extends Omit<SwitchProps, 'sx'> {
  variant?: SwitchVariant;
  size?: SwitchSize;
  label?: string;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
}

const getSwitchStyles = (variant: SwitchVariant, size: SwitchSize) => {
  let baseStyles = {
    width: size === 'small' ? 42 : 58,
    height: size === 'small' ? 26 : 38,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: `translateX(${size === 'small' ? 16 : 20}px)`,
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.26,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: size === 'small' ? 22 : 34,
      height: size === 'small' ? 22 : 34,
      boxShadow: '0 2px 4px 0 rgba(0,35,11,0.2)',
    },
    '& .MuiSwitch-track': {
      borderRadius: size === 'small' ? 13 : 19,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      opacity: 1,
      transition: 'background-color 0.3s',
    },
  };

  let variantStyles = {};
  switch (variant) {
    case 'primary':
      variantStyles = {
        '& .MuiSwitch-switchBase.Mui-checked': {
          '& + .MuiSwitch-track': {
            backgroundColor: '#5d4037',
          },
        },
      };
      break;
    case 'secondary':
    default:
      variantStyles = {
        '& .MuiSwitch-switchBase.Mui-checked': {
          '& + .MuiSwitch-track': {
            backgroundColor: '#795548',
          },
        },
      };
      break;
  }

  return {
    ...baseStyles,
    ...variantStyles,
  };
};

const EpunchSwitch: React.FC<EpunchSwitchProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  labelPlacement = 'end',
  ...props
}) => {
  const switchComponent = (
    <Switch
      sx={{
        ...getSwitchStyles(variant, size),
        border: '1px solid rgba(0, 0, 0, 0.1)',
      }}
      {...props}
    />
  );

  if (label) {
    const labelProps: FormControlLabelProps = {
      control: switchComponent,
      label,
      labelPlacement,
      sx: {
        '& .MuiFormControlLabel-label': {
          fontWeight: 'bold',
          color: '#3e2723',
          fontSize: size === 'small' ? '0.875rem' : '1rem',
        },
        border: '1px solid rgba(0, 0, 0, 0.1)',
      },
    };
    return <FormControlLabel {...labelProps} />;
  }

  return switchComponent;
};

export default EpunchSwitch; 
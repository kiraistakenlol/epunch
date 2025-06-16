import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { colors, typography } from '../../../theme/constants';

export interface EpunchSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const EpunchSwitch: React.FC<EpunchSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const switchComponent = (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        '& .MuiSwitch-switchBase': {
          '&.Mui-checked': {
            color: colors.text.light,
            '& + .MuiSwitch-track': {
              backgroundColor: colors.primary
            }
          }
        },
        '& .MuiSwitch-track': {
          backgroundColor: colors.border.default
        }
      }}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={label}
        disabled={disabled}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize.desktop.body,
            color: disabled ? colors.text.disabled : colors.text.primary
          }
        }}
      />
    );
  }

  return switchComponent;
}; 
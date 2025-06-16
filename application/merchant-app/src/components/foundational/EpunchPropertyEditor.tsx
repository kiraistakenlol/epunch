import React from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { colors } from '../../theme/constants';
import { EpunchButton } from './EpunchButton';

export type PropertyEditorField = {
  key: string;
  label: string;
  type: 'color' | 'text' | 'number' | 'toggle' | 'slider' | 'switch' | 'select';
  value?: any;
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

export interface EpunchPropertyEditorProps {
  /** Title for the property editor */
  title?: string;
  /** Array of fields to render */
  fields: PropertyEditorField[];
  /** Called when any field value changes */
  onChange: (key: string, value: any) => void;
  /** Called when save button is clicked */
  onSave?: () => void;
  /** Called when reset button is clicked */
  onReset?: () => void;
  /** Save button label */
  saveLabel?: string;
  /** Reset button label */
  resetLabel?: string;
  /** Whether save is disabled */
  saveDisabled?: boolean;
  /** Whether reset is disabled */
  resetDisabled?: boolean;
  /** Whether to show save button */
  showSaveButton?: boolean;
  /** Whether to show reset button */
  showResetButton?: boolean;
  /** Loading state for save */
  saving?: boolean;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Field spacing */
  spacing?: number;
}

export const EpunchPropertyEditor: React.FC<EpunchPropertyEditorProps> = ({
  title,
  fields,
  onChange,
  onSave,
  onReset,
  saveLabel = 'Save',
  resetLabel = 'Reset',
  saveDisabled = false,
  resetDisabled = false,
  showSaveButton = true,
  showResetButton = false,
  saving = false,
  layout = 'vertical',
  spacing = 2
}) => {
  const renderField = (field: PropertyEditorField) => {
    const { key, label, type, value, options, min, max, step, placeholder, fullWidth = true, disabled = false } = field;

    const fieldProps = {
      key,
      disabled,
      fullWidth
    };

    switch (type) {
      case 'color':
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(key, e.target.value)}
                sx={{ 
                  width: 60,
                  '& .MuiInputBase-input': {
                    height: 40,
                    padding: 0,
                    border: 'none',
                    borderRadius: '4px'
                  }
                }}
                disabled={disabled}
              />
              <TextField
                value={value || ''}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder || `${label} (hex)`}
                size="small"
                fullWidth={fullWidth}
                disabled={disabled}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary
                    }
                  }
                }}
              />
            </Box>
          </Box>
        );

      case 'text':
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
            <TextField
              value={value || ''}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={placeholder}
              size="small"
              {...fieldProps}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary
                  }
                }
              }}
            />
          </Box>
        );

      case 'number':
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
            <TextField
              type="number"
              value={value || ''}
              onChange={(e) => onChange(key, parseFloat(e.target.value))}
              placeholder={placeholder}
              size="small"
              {...fieldProps}
              inputProps={{ min, max, step }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary
                  }
                }
              }}
            />
          </Box>
        );

      case 'toggle':
        if (!options) return null;
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
            <ToggleButtonGroup
              value={value}
              exclusive
              onChange={(_, newValue) => newValue && onChange(key, newValue)}
              size="small"
              disabled={disabled}
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  border: `2px solid ${colors.border.default}`,
                  borderRadius: '6px',
                  '&.Mui-selected': {
                    backgroundColor: colors.primary,
                    color: colors.text.light,
                    '&:hover': {
                      backgroundColor: colors.primaryDark,
                    },
                  },
                  '&:not(.Mui-selected)': {
                    backgroundColor: colors.background.paper,
                    color: colors.text.secondary,
                    '&:hover': {
                      backgroundColor: colors.hover.background,
                    },
                  },
                },
              }}
            >
              {options.map(option => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        );

      case 'slider':
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}: {value}
            </Typography>
            <Slider
              value={value || min || 0}
              onChange={(_, newValue) => onChange(key, newValue)}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              sx={{
                color: colors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: colors.primary,
                  '&:hover': {
                    boxShadow: `0px 0px 0px 8px rgba(93, 64, 55, 0.16)`
                  }
                },
                '& .MuiSlider-track': {
                  backgroundColor: colors.primary
                },
                '& .MuiSlider-rail': {
                  backgroundColor: colors.border.default
                }
              }}
            />
          </Box>
        );

      case 'switch':
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!value}
                  onChange={(e) => onChange(key, e.target.checked)}
                  disabled={disabled}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: colors.primary,
                      '& + .MuiSwitch-track': {
                        backgroundColor: colors.primary,
                      },
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                  {label}
                </Typography>
              }
            />
          </Box>
        );

      case 'select':
        if (!options) return null;
        return (
          <Box key={key} sx={{ mb: spacing }}>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1, fontWeight: 500 }}>
              {label}
            </Typography>
            <FormControl size="small" fullWidth={fullWidth} disabled={disabled}>
              <Select
                value={value || ''}
                onChange={(e) => onChange(key, e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary
                  }
                }}
              >
                {options.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {title && (
        <Typography
          variant="h6"
          sx={{
            color: colors.text.primary,
            fontWeight: 600,
            mb: 3,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          gap: layout === 'horizontal' ? spacing : 0,
          flexWrap: layout === 'horizontal' ? 'wrap' : 'nowrap'
        }}
      >
        {fields.map(renderField)}
      </Box>

      {(showSaveButton || showResetButton) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 3,
            pt: 2,
            borderTop: `1px solid ${colors.border.divider}`
          }}
        >
          {showResetButton && onReset && (
            <EpunchButton
              variant="outlined"
              onClick={onReset}
              disabled={resetDisabled || saving}
            >
              {resetLabel}
            </EpunchButton>
          )}
          
          {showSaveButton && onSave && (
            <EpunchButton
              variant="primary"
              onClick={onSave}
              disabled={saveDisabled || saving}
              loading={saving}
            >
              {saving ? 'Saving...' : saveLabel}
            </EpunchButton>
          )}
        </Box>
      )}
    </Box>
  );
}; 
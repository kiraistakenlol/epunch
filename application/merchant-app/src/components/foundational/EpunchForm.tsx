import React from 'react';
import { Box } from '@mui/material';
import { EpunchCard } from './EpunchCard';
import { EpunchAlert } from './EpunchAlert';
import { EpunchButton } from './EpunchButton';
import { EpunchFlexRow } from './EpunchFlexRow';
import { colors, spacing } from '../../theme';

export interface EpunchFormProps {
  /** Form submission handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Whether submit button is disabled */
  submitDisabled?: boolean;
  /** Whether cancel button is disabled */
  cancelDisabled?: boolean;
  /** Form content */
  children: React.ReactNode;
  /** Form card variant */
  variant?: 'default' | 'elevated' | 'form';
  /** Form card padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const EpunchForm: React.FC<EpunchFormProps> = ({
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isSubmitting = false,
  error,
  submitDisabled = false,
  cancelDisabled = false,
  children,
  variant = 'form',
  padding = 'medium',
  ...props
}) => {
  return (
    <EpunchCard variant={variant} padding={padding}>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.lg
        }}
        {...props}
      >
        {error && (
          <EpunchAlert variant="error">
            {error}
          </EpunchAlert>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: spacing.lg 
        }}>
          {children}
        </Box>
        
        <Box
          sx={{
            pt: spacing.md,
            borderTop: `1px solid ${colors.border.divider}`
          }}
        >
          <EpunchFlexRow 
            justify="end" 
            gap={spacing.md}
          >
            {onCancel && (
              <EpunchButton
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={cancelDisabled || isSubmitting}
              >
                {cancelText}
              </EpunchButton>
            )}
            
            <EpunchButton
              type="submit"
              variant="primary"
              disabled={submitDisabled || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : submitText}
            </EpunchButton>
          </EpunchFlexRow>
        </Box>
      </Box>
    </EpunchCard>
  );
}; 
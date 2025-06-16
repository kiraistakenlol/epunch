import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors, spacing, shadows } from '../../../theme/constants';

export interface EpunchModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const EpunchModal: React.FC<EpunchModalProps> = ({
  open,
  onClose,
  title,
  children
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth={!isMobile}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: colors.background.paper,
          margin: isMobile ? 0 : spacing.lg,
          borderRadius: isMobile ? 0 : spacing.sm,
          boxShadow: shadows.heavy
        }
      }}
    >
      {(title || !isMobile) && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background.paper,
            borderBottom: title ? `1px solid ${colors.border.divider}` : 'none',
            padding: spacing.lg
          }}
        >
          {title && (
            <Typography
              variant="h6"
              sx={{
                color: colors.text.primary,
                fontWeight: 600,
                margin: 0
              }}
            >
              {title}
            </Typography>
          )}
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.text.secondary,
              marginLeft: title ? spacing.md : 0
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      
      <DialogContent
        sx={{
          backgroundColor: colors.background.paper,
          padding: spacing.lg
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}; 
import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { colors } from '../../theme/constants';

export interface EpunchModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Actions to display at bottom */
  actions?: React.ReactNode;
  /** Modal variant */
  variant?: 'dialog' | 'fullscreen' | 'drawer' | 'overlay';
  /** Size for dialog variant */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether clicking backdrop closes modal */
  disableBackdropClick?: boolean;
  /** Drawer anchor (only for drawer variant) */
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  /** Maximum width for dialog */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether modal is full width */
  fullWidth?: boolean;
}

export const EpunchModal: React.FC<EpunchModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  variant = 'dialog',
  size = 'medium',
  showCloseButton = true,
  disableBackdropClick = false,
  anchor = 'right',
  maxWidth = 'sm',
  fullWidth = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '400px', maxHeight: '70vh' };
      case 'large':
        return { width: '800px', maxHeight: '90vh' };
      case 'xlarge':
        return { width: '1000px', maxHeight: '95vh' };
      default:
        return { width: '600px', maxHeight: '80vh' };
    }
  };

  const handleClose = (_event?: any, reason?: string) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  // Mobile: Always use fullscreen or drawer
  const effectiveVariant = isMobile && variant === 'dialog' ? 'fullscreen' : variant;

  if (effectiveVariant === 'drawer') {
    return (
      <Drawer
        anchor={anchor}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '400px', md: '500px' },
            backgroundColor: colors.background.paper,
            padding: 0
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {(title || showCloseButton) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: `1px solid ${colors.border.divider}`,
                backgroundColor: colors.background.paper
              }}
            >
              {title && (
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <IconButton
                  onClick={() => onClose()}
                  sx={{ color: colors.text.secondary }}
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          )}
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {children}
          </Box>
          
          {actions && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${colors.border.divider}`,
                backgroundColor: colors.background.paper
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      </Drawer>
    );
  }

  if (effectiveVariant === 'fullscreen') {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: colors.background.default,
            margin: 0,
            borderRadius: 0
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {(title || showCloseButton) && (
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.background.paper,
                borderBottom: `1px solid ${colors.border.divider}`,
                py: 2
              }}
            >
              {title && (
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <IconButton
                  onClick={() => onClose()}
                  sx={{ color: colors.text.secondary }}
                >
                  <Close />
                </IconButton>
              )}
            </DialogTitle>
          )}
          
          <DialogContent sx={{ flex: 1, overflow: 'auto', backgroundColor: colors.background.default }}>
            {children}
          </DialogContent>
          
          {actions && (
            <DialogActions
              sx={{
                backgroundColor: colors.background.paper,
                borderTop: `1px solid ${colors.border.divider}`,
                p: 2
              }}
            >
              {actions}
            </DialogActions>
          )}
        </Box>
      </Dialog>
    );
  }

  if (effectiveVariant === 'overlay') {
    const { width, maxHeight } = getSizeStyles();
    
    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper
          sx={{
            width: { xs: '95%', sm: width },
            maxWidth: '95vw',
            maxHeight: { xs: '95vh', sm: maxHeight },
            overflow: 'auto',
            outline: 'none',
            borderRadius: '12px',
            backgroundColor: colors.background.paper
          }}
        >
          {(title || showCloseButton) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                borderBottom: title ? `1px solid ${colors.border.divider}` : 'none'
              }}
            >
              {title && (
                <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <IconButton
                  onClick={() => onClose()}
                  sx={{ 
                    color: colors.text.secondary,
                    ...(title ? {} : { position: 'absolute', right: 16, top: 16, zIndex: 1 })
                  }}
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          )}
          
          <Box sx={{ p: title ? 3 : 4 }}>
            {children}
          </Box>
          
          {actions && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                p: 3,
                borderTop: `1px solid ${colors.border.divider}`
              }}
            >
              {actions}
            </Box>
          )}
        </Paper>
      </Modal>
    );
  }

  // Default dialog variant
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: colors.background.paper,
          borderRadius: '12px'
        }
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1
          }}
        >
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              onClick={() => onClose()}
              sx={{ color: colors.text.secondary }}
            >
              <Close />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}; 
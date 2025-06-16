import React from 'react';
import { Box, CircularProgress, LinearProgress, Typography, Backdrop } from '@mui/material';
import { colors } from '../../theme/constants';

export interface EpunchLoadingStateProps {
  /** Whether loading is active */
  loading: boolean;
  /** Loading variant */
  variant?: 'spinner' | 'linear' | 'overlay' | 'inline' | 'button';
  /** Size of spinner */
  size?: 'small' | 'medium' | 'large';
  /** Loading message */
  message?: string;
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inherit';
  /** Children to show when not loading */
  children?: React.ReactNode;
  /** Whether to show overlay background */
  overlay?: boolean;
  /** Minimum height for container */
  minHeight?: string | number;
  /** Custom spinner color */
  spinnerColor?: string;
}

export const EpunchLoadingState: React.FC<EpunchLoadingStateProps> = ({
  loading,
  variant = 'spinner',
  size = 'medium',
  message,
  color = 'primary',
  children,
  overlay = false,
  minHeight,
  spinnerColor
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  const getSpinnerColor = () => {
    if (spinnerColor) return spinnerColor;
    
    switch (color) {
      case 'secondary':
        return colors.secondary;
      case 'inherit':
        return 'inherit';
      default:
        return colors.primary;
    }
  };

  const LoadingSpinner = () => (
    <CircularProgress
      size={getSpinnerSize()}
      sx={{ 
        color: getSpinnerColor(),
        ...(variant === 'button' && { mr: 1 })
      }}
    />
  );

  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: variant === 'button' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: variant === 'button' ? 1 : 2,
        ...(minHeight && { minHeight }),
        ...(variant === 'inline' && {
          p: 2
        })
      }}
    >
      {variant === 'linear' ? (
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: getSpinnerColor()
              }
            }}
          />
        </Box>
      ) : (
        <LoadingSpinner />
      )}
      
      {message && (
        <Typography
          variant={size === 'small' ? 'body2' : 'body1'}
          sx={{
            color: colors.text.secondary,
            textAlign: 'center',
            fontWeight: variant === 'button' ? 500 : 'normal'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  // Button loading variant - inline with content
  if (variant === 'button') {
    return loading ? <LoadingContent /> : children;
  }

  // Overlay variant - covers entire viewport
  if (variant === 'overlay' || overlay) {
    return (
      <>
        {children}
        <Backdrop
          open={loading}
          sx={{ 
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: colors.background.overlay
          }}
        >
          <LoadingContent />
        </Backdrop>
      </>
    );
  }

  // If not loading, show children
  if (!loading) {
    return <>{children}</>;
  }

  // Default loading state
  return <LoadingContent />;
};

// Convenience components for common patterns
export const EpunchButtonLoading: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}> = ({ loading, children, loadingText = 'Loading...' }) => (
  <EpunchLoadingState
    loading={loading}
    variant="button"
    size="small"
    message={loadingText}
  >
    {children}
  </EpunchLoadingState>
);

export const EpunchOverlayLoading: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}> = ({ loading, children, message = 'Loading...' }) => (
  <EpunchLoadingState
    loading={loading}
    variant="overlay"
    message={message}
  >
    {children}
  </EpunchLoadingState>
);

export const EpunchInlineLoading: React.FC<{
  loading: boolean;
  children?: React.ReactNode;
  message?: string;
  minHeight?: string | number;
}> = ({ loading, children, message = 'Loading...', minHeight = '200px' }) => (
  <EpunchLoadingState
    loading={loading}
    variant="inline"
    message={message}
    minHeight={minHeight}
  >
    {children}
  </EpunchLoadingState>
); 
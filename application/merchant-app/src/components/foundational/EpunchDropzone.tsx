import React from 'react';
import { Box, Typography } from '@mui/material';
import { Upload, InsertDriveFile } from '@mui/icons-material';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { colors } from '../../theme/constants';
import { EpunchButton } from './EpunchButton';

export interface EpunchDropzoneProps {
  /** Called when files are dropped or selected */
  onFilesAccepted: (files: File[]) => void;
  /** Called when files are rejected */
  onFilesRejected?: (rejectedFiles: any[]) => void;
  /** Whether the dropzone is disabled */
  disabled?: boolean;
  /** Whether to accept multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types */
  accept?: Record<string, string[]>;
  /** Custom dropzone text */
  dropText?: string;
  /** Custom browse text */
  browseText?: string;
  /** Help text shown below */
  helpText?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Visual variant */
  variant?: 'default' | 'compact';
}

export const EpunchDropzone: React.FC<EpunchDropzoneProps> = ({
  onFilesAccepted,
  onFilesRejected,
  disabled = false,
  multiple = false,
  maxSize,
  accept,
  dropText = 'Drag & drop files here, or click to select',
  browseText = 'Select Files',
  helpText,
  size = 'medium',
  variant = 'default'
}) => {
  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
    if (rejectedFiles.length > 0 && onFilesRejected) {
      onFilesRejected(rejectedFiles);
    }
  }, [onFilesAccepted, onFilesRejected]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    multiple,
    disabled,
    ...(maxSize && { maxSize }),
    ...(accept && { accept })
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { 
          padding: 2, 
          minHeight: '120px',
          iconSize: 40,
          titleVariant: 'body1' as const
        };
      case 'large':
        return { 
          padding: 6, 
          minHeight: '200px',
          iconSize: 80,
          titleVariant: 'h5' as const
        };
      default:
        return { 
          padding: 4, 
          minHeight: '160px',
          iconSize: 60,
          titleVariant: 'h6' as const
        };
    }
  };

  const { padding, minHeight, iconSize, titleVariant } = getSizeStyles();

  const getDropzoneStyles = () => {
    const baseStyles = {
      border: `2px dashed ${colors.primary}`,
      borderRadius: '8px',
      padding,
      textAlign: 'center' as const,
      cursor: disabled ? 'not-allowed' : 'pointer',
      minHeight,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: 'transparent'
    };

    if (disabled) {
      return {
        ...baseStyles,
        opacity: 0.6,
        borderColor: colors.border.default,
        cursor: 'not-allowed'
      };
    }

    if (isDragActive) {
      return {
        ...baseStyles,
        backgroundColor: `rgba(93, 64, 55, 0.04)`,
        borderColor: colors.primaryDark,
        transform: 'scale(1.02)'
      };
    }

    return {
      ...baseStyles,
      '&:hover': {
        backgroundColor: `rgba(93, 64, 55, 0.04)`,
        borderColor: colors.primaryDark
      }
    };
  };

  if (variant === 'compact') {
    return (
      <Box
        {...getRootProps()}
        sx={getDropzoneStyles()}
      >
        <input {...getInputProps()} />
        <InsertDriveFile sx={{ 
          fontSize: iconSize * 0.7, 
          color: disabled ? colors.border.default : colors.primary,
          mb: 1 
        }} />
        <Typography
          variant="body2"
          sx={{ 
            color: disabled ? colors.text.disabled : colors.text.primary,
            mb: 1,
            fontWeight: 500
          }}
        >
          {isDragActive ? 'Drop files here...' : dropText}
        </Typography>
        {helpText && (
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            {helpText}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      {...getRootProps()}
      sx={getDropzoneStyles()}
    >
      <input {...getInputProps()} />
      <Upload sx={{ 
        fontSize: iconSize, 
        color: disabled ? colors.border.default : colors.primary,
        mb: 2 
      }} />
      <Typography
        variant={titleVariant}
        sx={{ 
          color: disabled ? colors.text.disabled : colors.text.primary,
          mb: 1,
          fontWeight: 500
        }}
      >
        {isDragActive ? 'Drop files here...' : dropText}
      </Typography>
      {helpText && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.text.secondary, 
            mb: 2,
            textAlign: 'center'
          }}
        >
          {helpText}
        </Typography>
      )}
      <EpunchButton
        variant="primary"
        disabled={disabled}
        size={size === 'small' ? 'small' : 'medium'}
      >
        {browseText}
      </EpunchButton>
    </Box>
  );
}; 
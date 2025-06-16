import React from 'react';
import { Box, Typography } from '@mui/material';
import { ImageOutlined, Edit, Delete } from '@mui/icons-material';
import { colors } from '../../theme/constants';
import { EpunchButton } from './EpunchButton';

export interface EpunchImageDisplayProps {
  /** Image URL to display */
  imageUrl?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Shape variant */
  shape?: 'square' | 'circle';
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Whether to show edit button */
  showEditButton?: boolean;
  /** Whether to show delete button */
  showDeleteButton?: boolean;
  /** Edit button label */
  editButtonLabel?: string;
  /** Delete button label */
  deleteButtonLabel?: string;
  /** Placeholder text when no image */
  placeholderText?: string;
  /** Placeholder subtext */
  placeholderSubtext?: string;
  /** Called when edit button is clicked */
  onEdit?: () => void;
  /** Called when delete button is clicked */
  onDelete?: () => void;
  /** Called when image area is clicked (when no image) */
  onClick?: () => void;
  /** Whether the component is clickable when no image */
  clickable?: boolean;
}

export const EpunchImageDisplay: React.FC<EpunchImageDisplayProps> = ({
  imageUrl,
  alt = 'Image',
  size = 'medium',
  shape = 'square',
  disabled = false,
  showEditButton = false,
  showDeleteButton = false,
  editButtonLabel = 'Edit',
  deleteButtonLabel = 'Remove',
  placeholderText = 'No image set',
  placeholderSubtext = 'Click here to upload an image',
  onEdit,
  onDelete,
  onClick,
  clickable = false
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { 
          width: { xs: 120, sm: 140, md: 160 },
          height: { xs: 120, sm: 140, md: 160 },
          iconSize: 40,
          textVariant: 'body2' as const,
          subtextVariant: 'caption' as const
        };
      case 'large':
        return { 
          width: { xs: 280, sm: 320, md: 360 },
          height: { xs: 280, sm: 320, md: 360 },
          iconSize: 80,
          textVariant: 'h6' as const,
          subtextVariant: 'body2' as const
        };
      default:
        return { 
          width: { xs: 240, sm: 280, md: 320 },
          height: { xs: 240, sm: 280, md: 320 },
          iconSize: 60,
          textVariant: 'body1' as const,
          subtextVariant: 'body2' as const
        };
    }
  };

  const { width, height, iconSize, textVariant, subtextVariant } = getSizeStyles();

  const getDisplayStyles = () => {
    const baseStyles = {
      width,
      height,
      border: `2px solid ${colors.primaryLight}`,
      borderRadius: shape === 'circle' ? '50%' : '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative' as const,
      transition: 'all 0.2s ease-in-out'
    };

    if (disabled) {
      return {
        ...baseStyles,
        opacity: 0.6,
        borderColor: colors.border.default,
        cursor: 'not-allowed'
      };
    }

    if (imageUrl) {
      return {
        ...baseStyles,
        cursor: 'default',
        padding: 2
      };
    }

    if (clickable && onClick) {
      return {
        ...baseStyles,
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        padding: 2,
        '&:hover': {
          borderColor: colors.primaryDark,
          backgroundColor: '#fafafa',
          '& .upload-icon': {
            color: colors.primaryDark
          },
          '& .upload-text': {
            color: colors.primaryDark
          }
        }
      };
    }

    return {
      ...baseStyles,
      backgroundColor: '#ffffff',
      padding: 2
    };
  };

  const handleImageClick = () => {
    if (clickable && onClick && !disabled && !imageUrl) {
      onClick();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && !disabled) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && !disabled) {
      onDelete();
    }
  };

  return (
    <Box>
      {/* Image Display Area */}
      <Box
        sx={getDisplayStyles()}
        onClick={handleImageClick}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={alt}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              borderRadius: shape === 'circle' ? '50%' : '8px'
            }} 
          />
        ) : (
          <>
            <ImageOutlined
              className="upload-icon"
              sx={{
                fontSize: iconSize,
                color: '#bdbdbd',
                mb: 1,
                transition: 'color 0.2s ease-in-out'
              }}
            />
            <Typography
              className="upload-text"
              variant={textVariant}
              sx={{
                color: '#9e9e9e',
                fontWeight: 500,
                textAlign: 'center',
                transition: 'color 0.2s ease-in-out'
              }}
            >
              {placeholderText}
            </Typography>
            {placeholderSubtext && clickable && (
              <Typography
                variant={subtextVariant}
                sx={{
                  color: '#bdbdbd',
                  textAlign: 'center',
                  transition: 'color 0.2s ease-in-out',
                  mt: 0.5
                }}
              >
                {placeholderSubtext}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Action Buttons */}
      {imageUrl && (showEditButton || showDeleteButton) && (
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            mt: 2,
            justifyContent: size === 'small' ? 'center' : 'flex-start'
          }}
        >
          {showEditButton && onEdit && (
            <EpunchButton
              variant="outlined"
              size={size === 'large' ? 'medium' : 'small'}
              disabled={disabled}
              onClick={handleEdit}
            >
              <Edit sx={{ mr: 1, fontSize: '1rem' }} />
              {editButtonLabel}
            </EpunchButton>
          )}

          {showDeleteButton && onDelete && (
            <EpunchButton
              variant="text"
              size={size === 'large' ? 'medium' : 'small'}
              disabled={disabled}
              onClick={handleDelete}
              style={{ color: colors.text.secondary }}
            >
              <Delete sx={{ mr: 1, fontSize: '1rem' }} />
              {deleteButtonLabel}
            </EpunchButton>
          )}
        </Box>
      )}
    </Box>
  );
}; 
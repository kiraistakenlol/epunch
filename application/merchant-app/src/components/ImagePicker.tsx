import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, CircularProgress, Modal, Paper, ButtonGroup } from '@mui/material';
import { Delete, Upload, Edit, ImageOutlined, Save, Cancel, RadioButtonUnchecked, CropSquare } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { apiClient } from 'e-punch-common-ui';
import { ImageCropEditor } from './ImageCropEditor';
import { TransparencyBackground } from './TransparencyBackground';

interface ImagePickerProps {
  /** The URL of the currently displayed image (if any) */
  currentlyDisplayedImageUrl?: string | null;
  /** Called when image upload is completed successfully with the final public URL */
  onImageUploadCompleted: (publicImageUrl: string) => void;
  /** Called when user wants to delete the current image */
  onCurrentImageDeleted?: () => void;
  /** Called when any error occurs during image processing, upload, or validation */
  onErrorOccurred: (errorMessage: string) => void;
  /** Called when upload succeeds - for showing success messages (optional) */
  onUploadSuccess?: (message: string) => void;
  /** Configuration for S3 upload */
  uploadConfig: {
    /** Merchant ID for generating upload URLs */
    merchantId: string;
    /** Filename for the uploaded image */
    filename: string;
    /** API endpoint to call after successful upload (optional) */
    postUploadApiCall?: (merchantId: string, publicUrl: string) => Promise<void>;
  };
  /** Maximum allowed file size in bytes (default: 5MB) */
  maxFileSizeBytes?: number;
  /** Target dimensions for the processed image (default: 200x200) */
  targetImageDimensions?: { width: number; height: number };
  /** List of allowed MIME types (default: JPEG, PNG, WebP) */
  allowedImageFormats?: string[];
  /** Whether the entire component is disabled */
  isDisabled?: boolean;
  /** Text for the "Change Image" button */
  changeButtonLabel?: string;
  /** Help text shown to user about file requirements */
  fileRequirementsText?: string;
  /** Logo shape for cropping ('circle' | 'square') */
  logoShape?: 'circle' | 'square';
  /** Whether to show crop interface */
  showCropInterface?: boolean;
  /** Whether to show shape toggle buttons */
  showShapeToggle?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  currentlyDisplayedImageUrl,
  onImageUploadCompleted,
  onCurrentImageDeleted,
  onErrorOccurred,
  onUploadSuccess = undefined,
  uploadConfig,
  maxFileSizeBytes = 5 * 1024 * 1024,
  targetImageDimensions = { width: 200, height: 200 },
  allowedImageFormats = ['image/jpeg', 'image/png', 'image/webp'],
  isDisabled = false,
  changeButtonLabel = 'Change Image',
  fileRequirementsText = 'Max 5MB, JPEG/PNG/WebP',
  logoShape = 'circle',
  showCropInterface = false,
  showShapeToggle = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [originalFileType, setOriginalFileType] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [cropShape, setCropShape] = useState<'circle' | 'square'>(logoShape);
  const [getBlob, setGetBlob] = useState<(() => Promise<Blob>) | null>(null);
  
  const handleAPIReady = (blobFunction: () => Promise<Blob>) => {
    setGetBlob(() => blobFunction);
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        onErrorOccurred('File too large');
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        onErrorOccurred('Invalid file type');
      } else {
        onErrorOccurred('Invalid file');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOriginalFileType(file.type);
    };
    reader.onerror = () => onErrorOccurred('Failed to read file');
    reader.readAsDataURL(file);
  }, [onErrorOccurred]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedImageFormats.reduce((acc: Record<string, string[]>, type: string) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSizeBytes,
    multiple: false,
    disabled: isDisabled || isProcessing,
  });

  const handleSave = async () => {
    if (!imageSrc || !getBlob) {
      onErrorOccurred('No image selected');
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await getBlob();
      
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(
        uploadConfig.merchantId, 
        uploadConfig.filename
      );
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': 'image/webp' },
      });

      if (!response.ok) throw new Error('Upload failed');

      if (uploadConfig.postUploadApiCall) {
        await uploadConfig.postUploadApiCall(uploadConfig.merchantId, publicUrl);
      }

      const cacheBustedUrl = publicUrl + `?t=${Date.now()}`;
      onImageUploadCompleted(cacheBustedUrl);
      onUploadSuccess?.('Image uploaded successfully!');

      setImageSrc('');
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to process and upload image:', error);
      onErrorOccurred('Failed to process and upload image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    if (!onCurrentImageDeleted) return;
    if (!confirm('Remove image?')) return;
    onCurrentImageDeleted();
  };

  const reset = () => {
    setImageSrc('');
    setOriginalFileType('');
    setModalOpen(false);
    setCropShape(logoShape);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const handleShapeChange = (shape: 'circle' | 'square') => {
    setCropShape(shape);
  };



  return (
    <Box>
      {/* Image Display Zone - Always Visible */}
      <TransparencyBackground
        checkSize={24}
        onClick={!currentlyDisplayedImageUrl ? openModal : undefined}
        sx={{
          mb: 2,
          border: '2px solid #8d6e63',
          borderRadius: 2,
          p: 2,
          ...(currentlyDisplayedImageUrl ? {} : {
            backgroundColor: '#ffffff',
            backgroundImage: 'none'
          }),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: 240, sm: 280, md: 320 },
          height: { xs: 240, sm: 280, md: 320 },
          justifyContent: 'center',
          cursor: !currentlyDisplayedImageUrl ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          ...((!currentlyDisplayedImageUrl && !isDisabled) && {
            '&:hover': {
              borderColor: '#3e2723',
              backgroundColor: '#fafafa',
              '& .upload-icon': {
                color: '#3e2723'
              },
              '& .upload-text': {
                color: '#3e2723'
              }
            }
          })
        }}
      >
                {currentlyDisplayedImageUrl ? (
            <img 
              src={currentlyDisplayedImageUrl} 
              alt="Current image" 
              key={currentlyDisplayedImageUrl}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          ) : (
          <>
            <ImageOutlined
              className="upload-icon"
              sx={{
                fontSize: 60,
                color: '#bdbdbd',
                mb: 1,
                transition: 'color 0.2s ease-in-out'
              }}
            />
            <Typography
              className="upload-text"
              variant="body1"
              sx={{
                color: '#9e9e9e',
                fontWeight: 500,
                transition: 'color 0.2s ease-in-out'
              }}
            >
              No image set
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#bdbdbd',
                textAlign: 'center',
                transition: 'color 0.2s ease-in-out'
              }}
            >
              Click here to upload an image
            </Typography>
          </>
        )}
      </TransparencyBackground>

      {/* Action Buttons */}
      {currentlyDisplayedImageUrl && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={openModal}
            disabled={isDisabled}
            sx={{
              color: '#3e2723',
              borderColor: '#3e2723',
              '&:hover': {
                borderColor: '#5d4037',
                backgroundColor: 'rgba(62, 39, 35, 0.04)'
              }
            }}
          >
            {changeButtonLabel}
          </Button>

          {onCurrentImageDeleted && (
            <Button
              size="medium"
              startIcon={<Delete />}
              onClick={handleRemove}
              disabled={isDisabled}
              sx={{ color: '#5d4037' }}
            >
              Remove
            </Button>
          )}
        </Box>
      )}

      {/* Modal with Dropzone and Cropping */}
      <Modal
        open={modalOpen}
        onClose={reset}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflow: 'auto',
            p: 3,
            outline: 'none',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#3e2723' }}>
            {currentlyDisplayedImageUrl ? 'Update Image' : 'Upload Image'}
          </Typography>

          {!imageSrc ? (
            <Box>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #3e2723',
                  borderRadius: 1,
                  p: 4,
                  textAlign: 'center',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  backgroundColor: isDragActive ? 'rgba(62, 39, 35, 0.04)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isDisabled ? 'transparent' : 'rgba(62, 39, 35, 0.04)'
                  }
                }}
              >
                <input {...getInputProps()} />
                <Upload sx={{ fontSize: 60, color: '#3e2723', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#3e2723', mb: 1 }}>
                  {isDragActive
                    ? 'Drop the image here...'
                    : 'Drag & drop an image here, or click to select'
                  }
                </Typography>
                <Typography variant="body2" sx={{ color: '#5d4037', mb: 2 }}>
                  {fileRequirementsText}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  disabled={isDisabled}
                  sx={{
                    backgroundColor: '#3e2723',
                    '&:hover': { backgroundColor: '#5d4037' }
                  }}
                >
                  Select Image
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Shape Toggle */}
              {showShapeToggle && showCropInterface && (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <ButtonGroup variant="outlined" size="small">
                    <Button
                      onClick={() => handleShapeChange('circle')}
                      variant={cropShape === 'circle' ? 'contained' : 'outlined'}
                      startIcon={<RadioButtonUnchecked />}
                      sx={{
                        backgroundColor: cropShape === 'circle' ? '#3e2723' : 'transparent',
                        '&:hover': { backgroundColor: cropShape === 'circle' ? '#5d4037' : 'rgba(62, 39, 35, 0.04)' }
                      }}
                    >
                      Circle
                    </Button>
                    <Button
                      onClick={() => handleShapeChange('square')}
                      variant={cropShape === 'square' ? 'contained' : 'outlined'}
                      startIcon={<CropSquare />}
                      sx={{
                        backgroundColor: cropShape === 'square' ? '#3e2723' : 'transparent',
                        '&:hover': { backgroundColor: cropShape === 'square' ? '#5d4037' : 'rgba(62, 39, 35, 0.04)' }
                      }}
                    >
                      Square
                    </Button>
                  </ButtonGroup>
                </Box>
              )}

              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                {showCropInterface ? (
                  <ImageCropEditor
                    imageSrc={imageSrc}
                    cropShape={cropShape}
                    originalFileType={originalFileType}
                    targetImageDimensions={targetImageDimensions}
                    onAPIReady={handleAPIReady}
                  />
                ) : (
                  <TransparencyBackground
                    checkSize={40}
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #8d6e63'
                    }}
                  >
                    <img 
                      src={imageSrc} 
                      alt="Image preview" 
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }} 
                    />
                  </TransparencyBackground>
                )}
              </Box>

              {/* Crop Controls */}
              {showCropInterface && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#5d4037', display: 'block', textAlign: 'center', mt: 1 }}>
                    {cropShape === 'circle' ? 'Drag to reposition' : 'Drag to reposition • Resize with corners'}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<Cancel />}
                  onClick={reset}
                  disabled={isDisabled || isProcessing}
                  sx={{ color: '#5d4037' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={isProcessing ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
                  onClick={handleSave}
                  disabled={isDisabled || isProcessing}
                  sx={{
                    backgroundColor: '#3e2723',
                    '&:hover': { backgroundColor: '#5d4037' }
                  }}
                >
                  {isProcessing ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}; 
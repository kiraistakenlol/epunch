import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Delete, Upload } from '@mui/icons-material';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImagePickerProps {
  currentImageUrl?: string | null;
  onImageReady: (imageBlob: Blob, imageDataUrl: string) => void;
  onImageRemove?: () => void;
  onError: (error: string) => void;
  maxSizeBytes?: number;
  aspectRatio?: number;
  outputSize?: { width: number; height: number };
  acceptedTypes?: string[];
  disabled?: boolean;
  uploadButtonText?: string;
  changeButtonText?: string;
  helperText?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  currentImageUrl,
  onImageReady,
  onImageRemove,
  onError,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  aspectRatio = 1, // square by default
  outputSize = { width: 200, height: 200 },
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
  uploadButtonText = 'Upload Image',
  changeButtonText = 'Change Image',
  helperText = 'Max 5MB, JPEG/PNG/WebP',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({ 
    unit: '%', 
    width: 80, 
    height: 80, 
    x: 10, 
    y: 10 
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      onError('Invalid file type');
      return;
    }
    if (file.size > maxSizeBytes) {
      onError('File too large');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getCroppedImage = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas error'));

      canvas.width = outputSize.width;
      canvas.height = outputSize.height;
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize.width, outputSize.height);
      
      // Draw cropped image
      ctx.drawImage(
        image, 
        crop.x, 
        crop.y, 
        crop.width, 
        crop.height, 
        0, 
        0, 
        outputSize.width, 
        outputSize.height
      );

      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error('Failed to create image blob'));
      }, 'image/webp', 0.9);
    });
  };

  const handleSave = async () => {
    if (!imageRef.current) {
      onError('No image selected');
      return;
    }

    setIsProcessing(true);
    try {
      let cropToUse = completedCrop;
      
      // If no crop is defined, use the entire image
      if (!cropToUse) {
        cropToUse = {
          x: 0,
          y: 0,
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
          unit: 'px' as const
        };
      }
      
      const blob = await getCroppedImage(imageRef.current, cropToUse);
      const dataUrl = URL.createObjectURL(blob);
      
      onImageReady(blob, dataUrl);
      
      // Reset state
      setImageSrc('');
      setCompletedCrop(undefined);
    } catch (error) {
      onError('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    if (!onImageRemove) return;
    if (!confirm('Remove image?')) return;
    onImageRemove();
  };

  const reset = () => {
    setImageSrc('');
    setCompletedCrop(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box>
      {currentImageUrl && !imageSrc && (
        <Box sx={{ mb: 2 }}>
          <img 
            src={currentImageUrl} 
            alt="Current image" 
            style={{ 
              width: 120, 
              height: 120, 
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }} 
          />
          {onImageRemove && (
            <Box sx={{ mt: 1 }}>
              <Button 
                size="small" 
                startIcon={<Delete />} 
                onClick={handleRemove} 
                disabled={disabled || isProcessing}
                sx={{ color: '#5d4037' }}
              >
                Remove
              </Button>
            </Box>
          )}
        </Box>
      )}

      {!imageSrc ? (
        <Box>
          <input 
            ref={fileInputRef} 
            type="file" 
            accept={acceptedTypes.join(',')} 
            onChange={handleFileSelect} 
            hidden 
            disabled={disabled}
          />
          <Button 
            variant="outlined" 
            startIcon={<Upload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isProcessing}
            sx={{ 
              color: '#3e2723',
              borderColor: '#3e2723',
              '&:hover': {
                borderColor: '#5d4037',
                backgroundColor: 'rgba(62, 39, 35, 0.04)'
              }
            }}
          >
            {currentImageUrl ? changeButtonText : uploadButtonText}
          </Button>
          {helperText && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#5d4037' }}>
              {helperText}
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 2, display: 'inline-block', maxWidth: '100%' }}>
            <ReactCrop 
              crop={crop} 
              onChange={setCrop} 
              onComplete={setCompletedCrop} 
              aspect={aspectRatio}
            >
              <img 
                ref={imageRef} 
                src={imageSrc} 
                alt="Crop preview" 
                style={{ maxWidth: 300 }} 
              />
            </ReactCrop>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleSave} 
              disabled={isProcessing || disabled}
              sx={{ 
                backgroundColor: '#3e2723',
                '&:hover': { backgroundColor: '#5d4037' }
              }}
            >
              {isProcessing ? 'Processing...' : 'Save'}
            </Button>
            <Button 
              onClick={reset} 
              disabled={isProcessing || disabled}
              sx={{ color: '#5d4037' }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}; 
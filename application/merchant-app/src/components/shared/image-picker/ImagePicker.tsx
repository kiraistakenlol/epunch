import React, { useState, useCallback } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { 
  EpunchImageDisplay, 
  EpunchDropzone, 
  EpunchModal, 
  EpunchLoadingState,
  EpunchButton,
  EpunchPropertyEditor,
  PropertyEditorField
} from '../../foundational';
import { ImageCropEditor } from './ImageCropEditor';

export interface ImageUploadConfig {
  /** Merchant ID for generating upload URLs */
  merchantId: string;
  /** Filename for the uploaded image */
  filename: string;
  /** API endpoint to call after successful upload (optional) */
  postUploadApiCall?: (merchantId: string, publicUrl: string) => Promise<void>;
}

export interface ImageUploadLogicProps {
  /** The URL of the currently displayed image (if any) */
  currentImageUrl?: string | null;
  /** Called when image upload is completed successfully with the final public URL */
  onImageUploadCompleted: (publicImageUrl: string) => void;
  /** Called when user wants to delete the current image */
  onImageDeleted?: () => void;
  /** Called when any error occurs during image processing, upload, or validation */
  onError: (errorMessage: string) => void;
  /** Called when upload succeeds - for showing success messages (optional) */
  onSuccess?: (message: string) => void;
  /** Configuration for S3 upload */
  uploadConfig: ImageUploadConfig;
  /** Maximum allowed file size in bytes (default: 5MB) */
  maxFileSizeBytes?: number;
  /** Target dimensions for the processed image (default: 200x200) */
  targetImageDimensions?: { width: number; height: number };
  /** List of allowed MIME types (default: JPEG, PNG, WebP) */
  allowedImageFormats?: string[];
  /** Whether the entire component is disabled */
  disabled?: boolean;
  /** Logo shape for cropping ('circle' | 'square') */
  logoShape?: 'circle' | 'square';
  /** Whether to show crop interface */
  showCropInterface?: boolean;
  /** Whether to show shape toggle buttons */
  showShapeToggle?: boolean;
}

export const ImagePicker: React.FC<ImageUploadLogicProps> = ({
  currentImageUrl,
  onImageUploadCompleted,
  onImageDeleted,
  onError,
  onSuccess,
  uploadConfig,
  maxFileSizeBytes = 5 * 1024 * 1024,
  targetImageDimensions = { width: 200, height: 200 },
  allowedImageFormats = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
  logoShape = 'circle',
  showCropInterface = false,
  showShapeToggle = false
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

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSizeBytes) {
      return 'File too large';
    }
    
    if (!allowedImageFormats.includes(file.type)) {
      return 'Invalid file type';
    }
    
    return null;
  }, [maxFileSizeBytes, allowedImageFormats]);

  const handleFilesAccepted = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOriginalFileType(file.type);
    };
    reader.onerror = () => onError('Failed to read file');
    reader.readAsDataURL(file);
  }, [validateFile, onError]);

  const handleFilesRejected = useCallback((rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        onError('File too large');
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        onError('Invalid file type');
      } else {
        onError('Invalid file');
      }
    }
  }, [onError]);

  const uploadToS3 = async (blob: Blob): Promise<string> => {
    const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(
      uploadConfig.merchantId, 
      uploadConfig.filename
    );
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/webp' },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return publicUrl;
  };

  const handleSave = async () => {
    if (!imageSrc || !getBlob) {
      onError('No image selected');
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await getBlob();
      const publicUrl = await uploadToS3(blob);

      if (uploadConfig.postUploadApiCall) {
        await uploadConfig.postUploadApiCall(uploadConfig.merchantId, publicUrl);
      }

      const cacheBustedUrl = publicUrl + `?t=${Date.now()}`;
      onImageUploadCompleted(cacheBustedUrl);
      onSuccess?.('Image uploaded successfully!');

      handleReset();
    } catch (error) {
      console.error('Failed to process and upload image:', error);
      onError('Failed to process and upload image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = () => {
    if (!onImageDeleted) return;
    if (!confirm('Remove image?')) return;
    onImageDeleted();
  };

  const handleReset = () => {
    setImageSrc('');
    setOriginalFileType('');
    setModalOpen(false);
    setCropShape(logoShape);
  };

  const handleOpenEditor = () => {
    setModalOpen(true);
  };

  const handleCloseEditor = () => {
    setModalOpen(false);
  };

  const handleShapeChange = (shape: 'circle' | 'square') => {
    setCropShape(shape);
  };

  // Shape toggle fields for property editor
  const shapeFields: PropertyEditorField[] = showShapeToggle ? [
    {
      key: 'shape',
      label: 'Logo Shape',
      type: 'toggle',
      value: cropShape,
      options: [
        { value: 'circle', label: 'Circle' },
        { value: 'square', label: 'Square' }
      ]
    }
  ] : [];

  const handlePropertyChange = (key: string, value: any) => {
    if (key === 'shape') {
      handleShapeChange(value);
    }
  };

  return (
    <>
      {/* Main Image Display */}
      <EpunchImageDisplay
        imageUrl={currentImageUrl}
        alt="Current image"
        size="medium"
        shape="square"
        disabled={disabled}
        showEditButton={!!currentImageUrl}
        showDeleteButton={!!currentImageUrl && !!onImageDeleted}
        editButtonLabel="Change Image"
        deleteButtonLabel="Remove"
        placeholderText="No image set"
        placeholderSubtext="Click here to upload an image"
        onEdit={handleOpenEditor}
        onDelete={handleDelete}
        onClick={handleOpenEditor}
        clickable={!currentImageUrl}
      />

      {/* Upload/Edit Modal */}
      <EpunchModal
        open={modalOpen}
        onClose={handleCloseEditor}
        title={currentImageUrl ? 'Update Image' : 'Upload Image'}
        variant="overlay"
        size="large"
        actions={
          imageSrc && (
            <>
              <EpunchButton
                variant="text"
                onClick={handleReset}
                disabled={disabled || isProcessing}
              >
                Cancel
              </EpunchButton>
              <EpunchButton
                variant="primary"
                onClick={handleSave}
                disabled={disabled || isProcessing}
                loading={isProcessing}
              >
                {isProcessing ? 'Saving...' : 'Save'}
              </EpunchButton>
            </>
          )
        }
      >
        <EpunchLoadingState loading={isProcessing} variant="overlay">
          {!imageSrc ? (
            <EpunchDropzone
              onFilesAccepted={handleFilesAccepted}
              onFilesRejected={handleFilesRejected}
              disabled={disabled}
              maxSize={maxFileSizeBytes}
              accept={allowedImageFormats.reduce((acc: Record<string, string[]>, type: string) => ({ ...acc, [type]: [] }), {})}
              dropText="Drag & drop an image here, or click to select"
              browseText="Select Image"
              helpText="Max 5MB, JPEG/PNG/WebP"
              size="large"
            />
          ) : (
            <>
              {/* Shape Toggle */}
              {showShapeToggle && showCropInterface && shapeFields.length > 0 && (
                <EpunchPropertyEditor
                  fields={shapeFields}
                  onChange={handlePropertyChange}
                  showSaveButton={false}
                  layout="horizontal"
                  spacing={2}
                />
              )}

              {/* Image Preview/Crop */}
              {showCropInterface ? (
                <ImageCropEditor
                  imageSrc={imageSrc}
                  cropShape={cropShape}
                  originalFileType={originalFileType}
                  targetImageDimensions={targetImageDimensions}
                  onAPIReady={handleAPIReady}
                />
              ) : (
                <EpunchImageDisplay
                  imageUrl={imageSrc}
                  alt="Image preview"
                  size="medium"
                  shape="square"
                />
              )}
            </>
          )}
        </EpunchLoadingState>
      </EpunchModal>
    </>
  );
}; 
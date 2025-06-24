import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { EpunchModal, RemoveButton } from '../../../../components/foundational';
import { apiClient } from 'e-punch-common-ui';

interface LogoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logoUrl: string | null) => Promise<void>;
  merchantId?: string;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  merchantId
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveLogo = () => {
    onSave(null);
    onClose();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    if (!merchantId) {
      toast.error('Merchant ID is required for upload');
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileName = `logo-${Date.now()}-${file.name}`;
      
      // Get upload URL from API
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchantId, fileName);
      
      // Upload file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }
      
      // Save the S3 URL and close modal
      await onSave(publicUrl);
      onClose();
      toast.success('Logo uploaded successfully!');
      
    } catch (error: any) {
      console.error('Failed to upload logo:', error);
      toast.error(`Failed to upload logo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [onSave, onClose, merchantId]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  return (
    <EpunchModal
      open={isOpen}
      onClose={onClose}
      title="Logo Settings"
    >
      {/* Dropzone Area */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div 
          {...getRootProps()} 
          style={{
            border: `2px dashed ${isDragActive ? '#5d4037' : '#d0d0d0'}`,
            borderRadius: '12px',
            padding: '60px 40px',
            textAlign: 'center',
            backgroundColor: isDragActive ? '#f5f5f5' : '#fafafa',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            opacity: isUploading ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
        >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#5d4037' }}>⏳</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#3e2723' }}>
              Uploading...
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Please wait
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: isDragActive ? '#5d4037' : '#999' }}>
              📁
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#3e2723' }}>
              {isDragActive ? 'Drop image here' : 'Upload Logo'}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              Drag & drop or click to browse
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              JPG, PNG, GIF, WebP (max 2MB)
            </div>
          </>
        )}
        </div>
        
        <RemoveButton
          onClick={handleRemoveLogo}
          title="Remove current logo"
          top="16px"
          right="16px"
          size={20}
        />
      </div>
    </EpunchModal>
  );
}; 
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from 'e-punch-common-ui';
import { EpunchModal } from '../../../../components/foundational';

interface LogoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId: string;
  currentLogoUrl?: string | null;
  onSave: (logoUrl: string | null) => Promise<void>;
  isSaving?: boolean;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({
  isOpen,
  onClose,
  merchantId,
  currentLogoUrl,
  onSave,
  isSaving = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Generate upload URL
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(
        merchantId,
        selectedFile.name
      );

      // Upload file to the generated URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Save the logo URL
      await onSave(publicUrl);
      toast.success('Logo uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (confirm('Remove current logo?')) {
      try {
        await onSave(null);
        setPreviewUrl(null);
        setSelectedFile(null);
        toast.success('Logo removed successfully!');
        onClose();
      } catch (error) {
        console.error('Failed to remove logo:', error);
        toast.error('Failed to remove logo');
      }
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(currentLogoUrl || null);
    onClose();
  };

  return (
    <EpunchModal
      open={isOpen}
      onClose={handleClose}
      title="Logo Editor"
    >
      {/* Preview */}
      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        padding: '20px',
        border: '2px dashed #d0d0d0',
        borderRadius: '8px',
        backgroundColor: '#fafafa'
      }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Logo preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
              border: '1px solid #e0e0e0',
              borderRadius: '4px'
            }}
          />
        ) : (
          <div style={{
            padding: '40px',
            color: '#999',
            fontSize: '14px'
          }}>
            No logo selected
          </div>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isSaving}
          style={{
            padding: '10px 20px',
            backgroundColor: '#5d4037',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Choose Image
        </button>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={uploading || isSaving}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}

        {currentLogoUrl && (
          <button
            onClick={handleRemoveLogo}
            disabled={uploading || isSaving}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Remove
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <button
          onClick={handleClose}
          disabled={uploading || isSaving}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#5d4037',
            border: '2px solid #5d4037',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Close
        </button>
      </div>
    </EpunchModal>
  );
}; 
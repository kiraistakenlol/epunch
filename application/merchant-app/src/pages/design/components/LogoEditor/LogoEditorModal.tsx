import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { EpunchModal, EpunchButon } from '../../../../components/foundational';

interface LogoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logoUrl: string | null, file?: File) => Promise<void>;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleRemoveLogo = () => {
    onSave(null);
    onClose();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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

      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      
      // Save the blob URL with the file and close modal
      onSave(blobUrl, file);
      onClose();
    }
  }, [onSave, onClose]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
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
      <div 
        {...getRootProps()} 
        style={{
          border: `2px dashed ${isDragActive ? '#5d4037' : '#d0d0d0'}`,
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#f5f5f5' : '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '20px'
        }}
      >
        <input {...getInputProps()} />
        <div style={{
          fontSize: '64px',
          marginBottom: '20px',
          color: isDragActive ? '#5d4037' : '#999'
        }}>
          📁
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#3e2723'
        }}>
          {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
        </div>
        <div style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '16px'
        }}>
          or click to browse files
        </div>
        <div style={{
          fontSize: '14px',
          color: '#999'
        }}>
          Supports: JPG, PNG, GIF, WebP (max 2MB)
        </div>
      </div>

             {/* Remove Logo Option */}
       <div style={{
         textAlign: 'center',
         paddingTop: '16px',
         borderTop: '1px solid #e0e0e0'
       }}>
         <button
           onClick={handleRemoveLogo}
           style={{
             backgroundColor: 'transparent',
             color: '#d32f2f',
             border: '1px solid #d32f2f',
             padding: '8px 16px',
             borderRadius: '6px',
             cursor: 'pointer',
             fontSize: '14px',
             fontWeight: 'bold',
             transition: 'all 0.2s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.backgroundColor = '#ffebee';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.backgroundColor = 'transparent';
           }}
         >
           Remove Current Logo
         </button>
       </div>
    </EpunchModal>
  );
}; 
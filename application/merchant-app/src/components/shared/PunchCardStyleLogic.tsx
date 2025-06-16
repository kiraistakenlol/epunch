import React, { useState, useEffect } from 'react';
import { apiClient } from 'e-punch-common-ui';
import { 
  EpunchCard, 
  EpunchPropertyEditor, 
  PropertyEditorField,
  EpunchLoadingState
} from '../foundational';
import { ImagePicker, ImageUploadConfig } from './image-picker/ImagePicker';
import { PunchCardStyleDto } from 'e-punch-common-core';

export interface PunchCardStyle {
  id?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export interface PunchCardStyleLogicProps {
  /** Merchant ID */
  merchantId: string;
  /** Initial style data */
  initialStyle?: PunchCardStyleDto;
  /** Called when style is successfully saved */
  onSuccess?: (message: string) => void;
  /** Called when an error occurs */
  onError?: (errorMessage: string) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
}

export const PunchCardStyleLogic: React.FC<PunchCardStyleLogicProps> = ({
  merchantId,
  initialStyle = {},
  onSuccess,
  onError,
  disabled = false
}) => {
  const [punchCardStyle, setPunchCardStyle] = useState<PunchCardStyleDto>(initialStyle);
  const [hasChanges, setHasChanges] = useState(false);
  const [styleSaving, setStyleSaving] = useState(false);
  const [loading] = useState(false);

  // Track changes to enable/disable save button
  useEffect(() => {
    const hasStyleChanges = (
      punchCardStyle.primaryColor !== initialStyle.primaryColor ||
      punchCardStyle.secondaryColor !== initialStyle.secondaryColor
    );
    setHasChanges(hasStyleChanges);
  }, [punchCardStyle, initialStyle]);

  const handleColorChange = (field: 'primaryColor' | 'secondaryColor', value: string) => {
    setPunchCardStyle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePropertyChange = (key: string, value: any) => {
    if (key === 'primaryColor' || key === 'secondaryColor') {
      handleColorChange(key, value);
    }
  };

  const handleStyleSave = async () => {
    if (!merchantId) return;
    
    setStyleSaving(true);
    try {
      const styleData: { primaryColor?: string; secondaryColor?: string } = {};
      
      if (punchCardStyle.primaryColor) {
        styleData.primaryColor = punchCardStyle.primaryColor;
      }
      if (punchCardStyle.secondaryColor) {  
        styleData.secondaryColor = punchCardStyle.secondaryColor;
      }
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchantId, styleData);
      onSuccess?.('Design saved successfully!');
      setHasChanges(false);
    } catch (err) {
      onError?. ('Failed to save design');
    } finally {
      setStyleSaving(false);
    }
  };

  const handleImageUploadCompleted = (publicImageUrl: string) => {
    setPunchCardStyle(prev => ({
      ...prev,
      logoUrl: publicImageUrl
    }));
  };

  const handleImageDeleted = async () => {
    try {
      await apiClient.updateMerchantDefaultPunchCardLogo(merchantId, '');
      setPunchCardStyle(prev => ({
        ...prev,
        logoUrl: undefined
      }));
      onSuccess?.('Logo removed successfully!');
    } catch (error) {
      onError?.('Failed to remove logo');
    }
  };

  const handleImageError = (errorMessage: string) => {
    onError?.(errorMessage);
  };

  const handleImageSuccess = (message: string) => {
    onSuccess?.(message);
  };

  // Color property fields
  const colorFields: PropertyEditorField[] = [
    {
      key: 'primaryColor',
      label: 'Primary Color',
      type: 'color',
      value: punchCardStyle.primaryColor || '',
      placeholder: 'Primary color'
    },
    {
      key: 'secondaryColor',
      label: 'Secondary Color', 
      type: 'color',
      value: punchCardStyle.secondaryColor || '',
      placeholder: 'Secondary color'
    }
  ];

  // Image upload configuration
  const logoUploadConfig: ImageUploadConfig = {
    merchantId,
    filename: 'punch-card-default-logo.webp',
    postUploadApiCall: async (merchantId, publicUrl) => {
      await apiClient.updateMerchantDefaultPunchCardLogo(merchantId, publicUrl);
    }
  };

  return (
    <EpunchLoadingState loading={loading}>
      <EpunchCard title="Punch Card Design" variant="default">
        {/* Logo Section */}
        <ImagePicker
          currentImageUrl={punchCardStyle.logoUrl}
          onImageUploadCompleted={handleImageUploadCompleted}
          onImageDeleted={handleImageDeleted}
          onError={handleImageError}
          onSuccess={handleImageSuccess}
          uploadConfig={logoUploadConfig}
          disabled={disabled}
          logoShape="circle"
          showCropInterface={true}
          showShapeToggle={true}
        />

        {/* Color Editor */}
        <EpunchPropertyEditor
          title="Colors"
          fields={colorFields}
          onChange={handlePropertyChange}
          onSave={handleStyleSave}
          saveLabel="Save Colors"
          saveDisabled={!hasChanges}
          saving={styleSaving}
          showSaveButton={true}
          spacing={2}
        />
      </EpunchCard>
    </EpunchLoadingState>
  );
}; 
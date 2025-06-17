import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from 'e-punch-common-ui';
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';
import { EpunchPage, EpunchCard } from '../../components/foundational';
import { useAppSelector } from '../../store/hooks';
import { 
  StylePreviewSection, 
  QuickActionsGrid, 
  DesignLoadingState,
  ColorEditorModal,
  LogoEditorModal,
  IconsEditorModal
} from './components';

export const DesignPage: React.FC = () => {
  const merchant = useAppSelector(state => state.auth.merchant);
  
  const [currentStyle, setCurrentStyle] = useState<PunchCardStyleDto>({
    primaryColor: '#5d4037',
    secondaryColor: '#795548',
    logoUrl: null,
    backgroundImageUrl: null,
    punchIcons: null
  });

  const [updatedStyle, setUpdatedStyle] = useState<PunchCardStyleDto | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  const [modalVisibility, setModalVisibility] = useState({
    colors: false,
    logo: false,
    icons: false
  });
  
  const [loading, setLoading] = useState({
    fetch: false,
    save: false
  });

  // Load style on mount
  useEffect(() => {
    const fetchStyle = async () => {
      if (!merchant?.id) {
        return;
      }
      
      setLoading(prev => ({ ...prev, fetch: true }));
      
      try {
        const fetchedStyle = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id);
        const styleWithDefaults = {
          ...fetchedStyle,
          primaryColor: fetchedStyle.primaryColor || '#5d4037',
          secondaryColor: fetchedStyle.secondaryColor || '#795548'
        };
        setCurrentStyle(styleWithDefaults);
        setUpdatedStyle(null);
      } catch (error) {
        console.error('Failed to fetch style:', error);
        toast.error('Failed to load style settings. Using defaults.');
        const defaultStyle = {
          primaryColor: '#5d4037',
          secondaryColor: '#795548',
          logoUrl: null,
          backgroundImageUrl: null,
          punchIcons: null
        };
        setCurrentStyle(defaultStyle);
        setUpdatedStyle(null);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchStyle();
  }, [merchant?.id]);

  const openModal = (modal: 'colors' | 'logo' | 'icons') => {
    setModalVisibility(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: 'colors' | 'logo' | 'icons') => {
    setModalVisibility(prev => ({ ...prev, [modal]: false }));
  };

  const displayStyle = updatedStyle || currentStyle;

  const handleUpdateColors = async (primaryColor: string, secondaryColor: string) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      primaryColor,
      secondaryColor
    }));
  };

  const handleUpdateLogo = async (logoUrl: string | null, file?: File) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      logoUrl
    }));
    
    if (file) {
      setPendingImageFile(file);
    } else if (logoUrl === null) {
      setPendingImageFile(null);
    }
  };

  const handleUpdateIcons = async (icons: PunchIconsDto) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      punchIcons: icons
    }));
  };

  const handleApplyStyle = async () => {
    if (!merchant?.id || !updatedStyle) return;
    
    setLoading(prev => ({ ...prev, save: true }));
    try {
      let finalLogoUrl = updatedStyle.logoUrl;
      
      if (pendingImageFile) {
        const fileName = `logo-${Date.now()}-${pendingImageFile.name}`;
        const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchant.id, fileName);
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: pendingImageFile,
          headers: {
            'Content-Type': pendingImageFile.type,
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to S3');
        }
        
        finalLogoUrl = publicUrl;
        
        if (updatedStyle.logoUrl && updatedStyle.logoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(updatedStyle.logoUrl);
        }
      }
      
      const styleForApi: PunchCardStyleDto = {
        primaryColor: updatedStyle.primaryColor || null,
        secondaryColor: updatedStyle.secondaryColor || null,
        logoUrl: finalLogoUrl || null,
        backgroundImageUrl: updatedStyle.backgroundImageUrl || null,
        punchIcons: updatedStyle.punchIcons || null
      };
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, styleForApi);
      
      const finalUpdatedStyle = {
        ...updatedStyle,
        logoUrl: finalLogoUrl
      };
      
      setCurrentStyle(finalUpdatedStyle);
      setUpdatedStyle(null);
      setPendingImageFile(null);
      toast.success('Style applied successfully!');
    } catch (error) {
      console.error('Failed to apply style:', error);
      toast.error('Failed to apply style');
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleReset = () => {
    setUpdatedStyle(null);
  };

  return (
    <EpunchPage title="Design Settings">
      <EpunchCard>
        {loading.fetch ? (
          <DesignLoadingState />
        ) : (
          <>
            <StylePreviewSection
              currentStyle={currentStyle}
              updatedStyle={updatedStyle}
              onApplyStyle={handleApplyStyle}
              onReset={handleReset}
              loading={loading.save}
            />

            <QuickActionsGrid
              displayStyle={displayStyle}
              onEditColors={() => openModal('colors')}
              onEditLogo={() => openModal('logo')}
              onEditIcons={() => openModal('icons')}
            />
          </>
        )}

        {/* Modals */}
        <ColorEditorModal
          isOpen={modalVisibility.colors}
          onClose={() => closeModal('colors')}
          primaryColor={displayStyle.primaryColor || '#5d4037'}
          secondaryColor={displayStyle.secondaryColor || '#795548'}
          onSave={handleUpdateColors}
        />

        <LogoEditorModal
          isOpen={modalVisibility.logo}
          onClose={() => closeModal('logo')}
          onSave={handleUpdateLogo}
        />

        <IconsEditorModal
          isOpen={modalVisibility.icons}
          onClose={() => closeModal('icons')}
          currentIcons={displayStyle.punchIcons}
          onSave={handleUpdateIcons}
        />
      </EpunchCard>
    </EpunchPage>
  );
}; 
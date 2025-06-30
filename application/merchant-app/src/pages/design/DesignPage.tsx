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
  const merchant = useAppSelector(state => state.merchant.merchant);
  
  const [currentStyle, setCurrentStyle] = useState<PunchCardStyleDto>({
    primaryColor: null,
    secondaryColor: null,
    logoUrl: null,
    backgroundImageUrl: null,
    punchIcons: null
  });

  const [updatedStyle, setUpdatedStyle] = useState<PunchCardStyleDto | null>(null);
  
  const [modalVisibility, setModalVisibility] = useState({
    colors: false,
    logo: false,
    icons: false
  });
  
  const [loading, setLoading] = useState({
    fetch: false,
    save: false
  });

  // Preview options state
  const [previewOptions, setPreviewOptions] = useState({
    currentPunches: 3,
    totalPunches: 10,
    status: 'ACTIVE' as 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED',
    showAnimations: false
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
        setCurrentStyle(fetchedStyle);
        setUpdatedStyle(null);
      } catch (error) {
        console.error('Failed to fetch style:', error);
        toast.error('Failed to load style settings. Using defaults.');
        const defaultStyle = {
          primaryColor: null,
          secondaryColor: null,
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

  const handleUpdateColors = async (primaryColor: string | null, secondaryColor: string | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      primaryColor,
      secondaryColor
    }));
  };

  const handleUpdateLogo = async (logoUrl: string | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      logoUrl
    }));
  };

  const handleUpdateIcons = async (icons: PunchIconsDto | null) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      punchIcons: icons
    }));
  };

  const handleRemoveCustomIcons = async () => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      punchIcons: null
    }));
  };

  const handleApplyStyle = async () => {
    if (!merchant?.id || !updatedStyle) return;
    
    setLoading(prev => ({ ...prev, save: true }));
    try {
      const styleForApi: PunchCardStyleDto = {
        primaryColor: updatedStyle.primaryColor || null,
        secondaryColor: updatedStyle.secondaryColor || null,
        logoUrl: updatedStyle.logoUrl || null,
        backgroundImageUrl: updatedStyle.backgroundImageUrl || null,
        punchIcons: updatedStyle.punchIcons || null
      };
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, styleForApi);
      
      setCurrentStyle(updatedStyle);
      setUpdatedStyle(null);
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
              previewOptions={previewOptions}
              onPreviewOptionsChange={setPreviewOptions}
            />

            <QuickActionsGrid
              displayStyle={displayStyle}
              onEditColors={() => openModal('colors')}
              onEditLogo={() => openModal('logo')}
              onEditIcons={() => openModal('icons')}
              onRemoveCustomIcons={handleRemoveCustomIcons}
              onRemoveColors={() => handleUpdateColors(null, null)}
              onRemoveLogo={() => handleUpdateLogo(null)}
            />
          </>
        )}

        {/* Modals */}
        <ColorEditorModal
          isOpen={modalVisibility.colors}
          onClose={() => closeModal('colors')}
          primaryColor={displayStyle.primaryColor}
          secondaryColor={displayStyle.secondaryColor}
          onSave={handleUpdateColors}
        />

        <LogoEditorModal
          isOpen={modalVisibility.logo}
          onClose={() => closeModal('logo')}
          onSave={handleUpdateLogo}
          merchantId={merchant?.id}
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
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SVG from 'react-inlinesvg';
import { apiClient } from 'e-punch-common-ui';
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';
import { EpunchPage, EpunchCard, EpunchConfirmOrCancelButtons } from '../../components/foundational';
import { useAppSelector } from '../../store/hooks';
import { ColorEditorModal } from './components/ColorEditor/ColorEditorModal';
import { LogoEditorModal } from './components/LogoEditor/LogoEditorModal';
import { IconsEditorModal } from './components/IconsEditor/IconsEditorModal';
import { PunchCardPreview } from './components/PunchCardPreview';

export const DesignPage: React.FC = () => {
  const merchant = useAppSelector(state => state.auth.merchant);
  
  // Two simple states: current (saved) and updated (pending)
  const [currentStyle, setCurrentStyle] = useState<PunchCardStyleDto>({
    primaryColor: '#5d4037',
    secondaryColor: '#795548',
    logoUrl: null,
    backgroundImageUrl: null,
    punchIcons: null
  });

  const [updatedStyle, setUpdatedStyle] = useState<PunchCardStyleDto | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  
  const [modals, setModals] = useState({
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
        setUpdatedStyle(null); // Clear any pending changes
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

  const openModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  // Get the style to show in previews and modals (updated if exists, otherwise current)
  const displayStyle = updatedStyle || currentStyle;

  // Handlers for updating pending changes
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
    
    // If a file is provided, store it for later upload
    if (file) {
      setPendingImageFile(file);
    } else if (logoUrl === null) {
      // If removing logo, clear pending file
      setPendingImageFile(null);
    }
  };

  const handleUpdateIcons = async (icons: PunchIconsDto) => {
    setUpdatedStyle(prev => ({
      ...(prev || currentStyle),
      punchIcons: icons
    }));
  };

  // Apply changes to server
  const handleApplyStyle = async () => {
    if (!merchant?.id || !updatedStyle) return;
    
    setLoading(prev => ({ ...prev, save: true }));
    try {
      let finalLogoUrl = updatedStyle.logoUrl;
      
      // If there's a pending image file, upload it to S3 first
      if (pendingImageFile) {
        const fileName = `logo-${Date.now()}-${pendingImageFile.name}`;
        const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchant.id, fileName);
        
        // Upload the file to S3
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
        
        // Clean up the blob URL
        if (updatedStyle.logoUrl && updatedStyle.logoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(updatedStyle.logoUrl);
        }
      }
      
      // Ensure proper null values for API compatibility
      const styleForApi: PunchCardStyleDto = {
        primaryColor: updatedStyle.primaryColor || null,
        secondaryColor: updatedStyle.secondaryColor || null,
        logoUrl: finalLogoUrl || null,
        backgroundImageUrl: updatedStyle.backgroundImageUrl || null,
        punchIcons: updatedStyle.punchIcons || null
      };
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, styleForApi);
      
      // Update current style with the final S3 URL
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

  // Reset changes
  const handleReset = () => {
    setUpdatedStyle(null);
  };

  if (loading.fetch) {
    return (
      <EpunchPage title="Design Settings">
        <EpunchCard>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #5d4037',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ 
              margin: 0, 
              color: '#5d4037', 
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Loading style settings...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </EpunchCard>
      </EpunchPage>
    );
  }

  return (
    <EpunchPage title="Design Settings">
      <EpunchCard>
        <div className="design-page card-content" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '24px', color: '#3e2723' }}>
            Punch Card Style
          </h2>

          {/* Preview Section */}
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '12px',
            backgroundColor: '#f8f8f8'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#3e2723', fontSize: '20px', textAlign: 'center' }}>
              📱 {updatedStyle ? 'Current vs New Style' : 'Current Style'}
            </h3>
            
            <div 
              className="preview-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: updatedStyle ? '1fr auto 1fr' : '1fr',
                gap: '24px',
                justifyItems: 'center',
                alignItems: 'center'
              }}
            >
                             {/* Current Style */}
               <div style={{ textAlign: 'center' }}>
                 <PunchCardPreview
                   primaryColor={currentStyle.primaryColor || '#5d4037'}
                   secondaryColor={currentStyle.secondaryColor || '#795548'}
                   logoUrl={currentStyle.logoUrl}
                   punchIcons={currentStyle.punchIcons}
                   size="large"
                 />
               </div>

               {/* Arrow (only show if there are changes) */}
               {updatedStyle && (
                 <div 
                   className="preview-arrow"
                   style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center',
                     fontSize: '32px',
                     color: '#5d4037'
                   }}
                 >
                   →
                 </div>
               )}

               {/* Updated Style (only show if there are changes) */}
               {updatedStyle && (
                 <div style={{ textAlign: 'center' }}>
                   <PunchCardPreview
                     primaryColor={updatedStyle.primaryColor || '#5d4037'}
                     secondaryColor={updatedStyle.secondaryColor || '#795548'}
                     logoUrl={updatedStyle.logoUrl}
                     punchIcons={updatedStyle.punchIcons}
                     size="large"
                   />
                 </div>
               )}
             </div>

             {/* Apply/Reset Buttons - only show if there are pending changes */}
             {updatedStyle && (
               <div 
                 className="apply-buttons"
                 style={{
                   paddingTop: '20px',
                   borderTop: '1px solid #e0e0e0',
                   display: 'flex',
                   justifyContent: 'center'
                 }}
               >
                 <EpunchConfirmOrCancelButtons
                   onCancel={handleReset}
                   onConfirm={handleApplyStyle}
                   cancelText="Reset"
                   confirmText="Apply Style"
                   confirmDisabled={loading.save}
                   cancelDisabled={loading.save}
                 />
               </div>
             )}
           </div>
          
          {/* Quick Actions Grid */}
          <div 
            className="quick-actions-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            {/* Colors Quick Action */}
            <div 
              onClick={() => openModal('colors')}
              style={{ 
                padding: '24px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5d4037';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎨</div>
              <h4 style={{ margin: '0 0 16px 0', color: '#3e2723', fontSize: '18px' }}>Edit Colors</h4>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: displayStyle.primaryColor || '#5d4037',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }} />
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: displayStyle.secondaryColor || '#795548',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }} />
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                Primary & Secondary colors
              </p>
            </div>

            {/* Logo Quick Action */}
            <div 
              onClick={() => openModal('logo')}
              style={{ 
                padding: '24px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5d4037';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🖼️</div>
              <h4 style={{ margin: '0 0 16px 0', color: '#3e2723', fontSize: '18px' }}>Edit Logo</h4>
              <div style={{ 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                {displayStyle.logoUrl ? (
                  <img 
                    src={displayStyle.logoUrl} 
                    alt="Logo" 
                    style={{
                      maxWidth: '60px',
                      maxHeight: '60px',
                      objectFit: 'contain',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '24px',
                    border: '2px dashed #d0d0d0'
                  }}>
                    +
                  </div>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                {displayStyle.logoUrl ? 'Change logo' : 'Add logo'}
              </p>
            </div>

            {/* Icons Quick Action */}
            <div 
              onClick={() => openModal('icons')}
              style={{ 
                padding: '24px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5d4037';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚪</div>
              <h4 style={{ margin: '0 0 16px 0', color: '#3e2723', fontSize: '18px' }}>Edit Icons</h4>
              <div style={{ 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '12px'
              }}>
                {displayStyle.punchIcons ? (
                  (() => {
                    try {
                      return (
                        <>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: displayStyle.secondaryColor || '#795548',
                            border: '2px solid #f0f0f0',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}>
                            <SVG 
                              src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.filled.data.svg_raw_content)}`}
                              width={24}
                              height={24}
                            />
                          </div>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: displayStyle.secondaryColor || '#795548',
                            border: '2px solid #f0f0f0',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}>
                            <SVG 
                              src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.unfilled.data.svg_raw_content)}`}
                              width={24}
                              height={24}
                            />
                          </div>
                        </>
                      );
                    } catch (error) {
                      return (
                        <>
                          <div style={{ 
                            fontSize: '24px', 
                            color: displayStyle.secondaryColor || '#795548',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #f0f0f0',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}>●</div>
                          <div style={{ 
                            fontSize: '24px', 
                            color: displayStyle.secondaryColor || '#795548',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #f0f0f0',
                            borderRadius: '6px',
                            backgroundColor: 'white'
                          }}>○</div>
                        </>
                      );
                    }
                  })()
                ) : (
                  <>
                    <div style={{ 
                      fontSize: '24px', 
                      color: displayStyle.secondaryColor || '#795548',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #f0f0f0',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}>●</div>
                    <div style={{ 
                      fontSize: '24px', 
                      color: displayStyle.secondaryColor || '#795548',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #f0f0f0',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}>○</div>
                  </>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                {displayStyle.punchIcons ? 'Custom icons' : 'Default circles'}
              </p>
            </div>
          </div>


        </div>
      </EpunchCard>

      {/* Modals */}
      <ColorEditorModal
        isOpen={modals.colors}
        onClose={() => closeModal('colors')}
        primaryColor={displayStyle.primaryColor || '#5d4037'}
        secondaryColor={displayStyle.secondaryColor || '#795548'}
        onSave={handleUpdateColors}
      />

      <LogoEditorModal
        isOpen={modals.logo}
        onClose={() => closeModal('logo')}
        onSave={handleUpdateLogo}
      />

      <IconsEditorModal
        isOpen={modals.icons}
        onClose={() => closeModal('icons')}
        currentIcons={displayStyle.punchIcons}
        onSave={handleUpdateIcons}
      />

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .preview-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          /* Change arrow direction on mobile */
          .preview-arrow {
            transform: rotate(90deg) !important;
          }
          
          /* Make action cards smaller on mobile */
          .design-page .quick-actions-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          /* Reduce padding on mobile */
          .design-page .card-content {
            padding: 16px !important;
          }
          
          /* Stack Apply/Reset buttons on mobile */
          .design-page .apply-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </EpunchPage>
  );
}; 
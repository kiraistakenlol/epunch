import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SVG from 'react-inlinesvg';
import { apiClient } from 'e-punch-common-ui';
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';
import { EpunchPage, EpunchCard } from '../../components/foundational';
import { useAppSelector } from '../../store/hooks';
import { ColorEditorModal } from './components/ColorEditor/ColorEditorModal';
import { LogoEditorModal } from './components/LogoEditor/LogoEditorModal';
import { IconsEditorModal } from './components/IconsEditor/IconsEditorModal';

export const DesignPage: React.FC = () => {
  const merchant = useAppSelector(state => state.auth.merchant);
  
  // Simple state management
  const [style, setStyle] = useState<PunchCardStyleDto>({
    primaryColor: '#5d4037',
    secondaryColor: '#795548',
    logoUrl: null,
    backgroundImageUrl: null,
    punchIcons: null
  });
  
  const [modals, setModals] = useState({
    colors: false,
    logo: false,
    icons: false
  });
  
  const [loading, setLoading] = useState({
    fetch: false,
    save: false
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
          setStyle(styleWithDefaults);
          setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Failed to fetch style:', error);
          toast.error('Failed to load style settings. Using defaults.');
          setStyle({
            primaryColor: '#5d4037',
            secondaryColor: '#795548',
            logoUrl: null,
            backgroundImageUrl: null,
            punchIcons: null
          });
          setHasUnsavedChanges(false);
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

  const handleSaveAll = async () => {
    if (!merchant?.id) return;
    
    setLoading(prev => ({ ...prev, save: true }));
    try {
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, {
        primaryColor: style.primaryColor || undefined,
        secondaryColor: style.secondaryColor || undefined
      });
      setHasUnsavedChanges(false);
      toast.success('Style settings saved successfully!');
    } catch (error) {
      console.error('Failed to save style:', error);
      toast.error('Failed to save style settings');
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleUpdateColors = async (primaryColor: string, secondaryColor: string) => {
    if (!merchant?.id) return;
    
    setLoading(prev => ({ ...prev, save: true }));
    try {
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, {
        primaryColor,
        secondaryColor
      });
      setStyle(prev => ({
        ...prev,
        primaryColor,
        secondaryColor
      }));
      setHasUnsavedChanges(false);
      toast.success('Colors updated successfully!');
    } catch (error) {
      console.error('Failed to update colors:', error);
      toast.error('Failed to update colors');
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleUpdateLogo = async (logoUrl: string | null) => {
    if (!merchant?.id) return;
    
    await apiClient.updateMerchantDefaultPunchCardLogo(merchant.id, logoUrl || '');
    setStyle(prev => ({
      ...prev,
      logoUrl
    }));
    setHasUnsavedChanges(false);
  };

  const handleUpdateIcons = async (icons: PunchIconsDto) => {
    if (!merchant?.id) return;
    
    await apiClient.updateMerchantDefaultPunchIcons(merchant.id, icons);
    setStyle(prev => ({
      ...prev,
      punchIcons: JSON.stringify(icons)
    }));
    setHasUnsavedChanges(false);
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
        <div style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '24px', color: '#3e2723' }}>
            Punch Card Style
            {hasUnsavedChanges && (
              <span style={{ 
                marginLeft: '16px', 
                backgroundColor: '#ff9800', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Unsaved Changes
              </span>
            )}
          </h2>
          
          {/* Colors Section */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '8px',
            backgroundColor: '#f8f8f8'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#3e2723' }}>🎨 Colors</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: style.primaryColor || '#5d4037',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  margin: '0 auto 8px'
                }} />
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Primary</div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace' }}>
                  {style.primaryColor || '#5d4037'}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: style.secondaryColor || '#795548',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  margin: '0 auto 8px'
                }} />
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Secondary</div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace' }}>
                  {style.secondaryColor || '#795548'}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => openModal('colors')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#5d4037',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Edit Colors
            </button>
          </div>

          {/* Logo Section */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '8px',
            backgroundColor: '#f8f8f8'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#3e2723' }}>🖼️ Logo</h3>
            
            {style.logoUrl ? (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <img 
                  src={style.logoUrl} 
                  alt="Current logo" 
                  style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    objectFit: 'contain',
                    border: '2px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            ) : (
              <p style={{ marginBottom: '16px', color: '#666' }}>No logo set</p>
            )}
            
            <button 
              onClick={() => openModal('logo')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#5d4037',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {style.logoUrl ? 'Change Logo' : 'Add Logo'}
            </button>
          </div>

          {/* Icons Section */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '20px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '8px',
            backgroundColor: '#f8f8f8'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#3e2723' }}>⚪ Punch Icons</h3>
            
            {style.punchIcons ? (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  {(() => {
                    try {
                      const parsed = JSON.parse(style.punchIcons);
                      return (
                        <>
                          <div style={{ textAlign: 'center' }}>
                            <div 
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '4px',
                                color: style.secondaryColor || '#795548'
                              }}
                            >
                              <SVG 
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(parsed.filled.data.svg_raw_content)}`}
                                width={24}
                                height={24}
                              />
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>Filled</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div 
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '4px',
                                color: style.secondaryColor || '#795548'
                              }}
                            >
                              <SVG 
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(parsed.unfilled.data.svg_raw_content)}`}
                                width={24}
                                height={24}
                              />
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>Unfilled</div>
                          </div>
                        </>
                      );
                    } catch (error) {
                      return (
                        <>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>●</div>
                            <div style={{ fontSize: '10px', color: '#666' }}>Filled</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>○</div>
                            <div style={{ fontSize: '10px', color: '#666' }}>Unfilled</div>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
                
                {/* Mini preview of punch card with icons */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px',
                    color: style.primaryColor || '#5d4037'
                  }}>
                    Preview
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {[...Array(5)].map((_, i) => {
                      try {
                        const parsed = JSON.parse(style.punchIcons!);
                        const svgContent = i < 3 
                          ? parsed.filled.data.svg_raw_content 
                          : parsed.unfilled.data.svg_raw_content;
                                                 return (
                           <div
                             key={i}
                             style={{
                               width: '20px',
                               height: '20px',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               color: style.secondaryColor || '#795548'
                             }}
                           >
                             <SVG 
                               src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
                               width={16}
                               height={16}
                             />
                           </div>
                         );
                      } catch (error) {
                        return (
                          <div
                            key={i}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: i < 3 ? (style.secondaryColor || '#795548') : 'transparent',
                              border: `2px solid ${style.secondaryColor || '#795548'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: i < 3 ? 'white' : (style.secondaryColor || '#795548'),
                              fontWeight: 'bold'
                            }}
                          >
                            {i < 3 ? '✓' : ''}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>✓ Custom icons configured</p>
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px', color: style.secondaryColor || '#795548' }}>●</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Filled</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px', color: style.secondaryColor || '#795548' }}>○</div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Unfilled</div>
                  </div>
                </div>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Using default circle icons</p>
              </div>
            )}
            
            <button 
              onClick={() => openModal('icons')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#5d4037',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {style.punchIcons ? 'Change Icons' : 'Customize Icons'}
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid #d7ccc8'
          }}>
            <button 
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges || loading.save}
              style={{
                padding: '10px 20px',
                backgroundColor: hasUnsavedChanges ? '#5d4037' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              {loading.save ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </EpunchCard>

      {/* Color Editor Modal */}
      <ColorEditorModal
        isOpen={modals.colors}
        onClose={() => closeModal('colors')}
        primaryColor={style.primaryColor || '#5d4037'}
        secondaryColor={style.secondaryColor || '#795548'}
        currentIcons={style.punchIcons}
        onSave={handleUpdateColors}
        isSaving={loading.save}
      />

      {/* Logo Editor Modal */}
      <LogoEditorModal
        isOpen={modals.logo}
        onClose={() => closeModal('logo')}
        merchantId={merchant?.id || ''}
        currentLogoUrl={style.logoUrl}
        onSave={handleUpdateLogo}
        isSaving={loading.save}
      />

      {/* Icons Editor Modal */}
      <IconsEditorModal
        isOpen={modals.icons}
        onClose={() => closeModal('icons')}
        merchantId={merchant?.id || ''}
        currentIcons={style.punchIcons}
        onSave={handleUpdateIcons}
        isSaving={loading.save}
      />
    </EpunchPage>
  );
}; 
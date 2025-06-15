import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Palette } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { ImagePicker } from '../components/ImagePicker';
import { apiClient } from 'e-punch-common-ui';
import { MerchantDto, IconDto, PunchIconsDto } from 'e-punch-common-core';
import { 
  SVGProperties, 
  IconType,
  IconState,
  IconPreviewSection, 
  IconGrid, 
  IconCustomizationPanel 
} from '../components/IconCustomizer';
import { RootState } from '../store/store';

interface PunchCardStyle {
  id?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export const Design: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const authMerchant = useAppSelector((state: any) => state.auth.merchant);
  const authState = useAppSelector((state: RootState) => state.auth);
  const [merchant, setMerchant] = useState<MerchantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [punchCardStyle, setPunchCardStyle] = useState<PunchCardStyle>({});

  const [styleLoading, setStyleLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Icon picker state - embedded from IconPickerPage
  const [iconLoading, setIconLoading] = useState(true);
  const [iconError, setIconError] = useState<string | null>(null);
  const [iconSuccess, setIconSuccess] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('coffee');
  const [foundIcons, setFoundIcons] = useState<IconDto[]>([]);
  const [totalIcons, setTotalIcons] = useState(0);
  
  const [activeIconType, setActiveIconType] = useState<IconType>('filled');

  const [iconStates, setIconStates] = useState<Record<IconType, IconState>>({
    filled: {
      icon: null,
      properties: {
        size: 64,
        color: '#4caf50',
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '',
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      }
    },
    unfilled: {
      icon: null,
      properties: {
        size: 64,
        color: '#e0e0e0',
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '',
        opacity: 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      }
    }
  });

  const [iconSaving, setIconSaving] = useState(false);

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authMerchant?.id) {
        setError('Merchant not authenticated');
        setLoading(false);
        return;
      }

      try {
        const merchantData = await apiClient.getMerchantById(authMerchant.id);
        setMerchant(merchantData);
        
        try {
          const styleData = await apiClient.getMerchantDefaultPunchCardStyle(authMerchant.id);
          setPunchCardStyle({
            primaryColor: styleData.primaryColor || undefined,
            secondaryColor: styleData.secondaryColor || undefined,
            logoUrl: styleData.logoUrl || undefined
          });
        } catch (styleErr: any) {
          console.warn('No punch card style found, using defaults:', styleErr.message);
          setPunchCardStyle({
            primaryColor: undefined,
            secondaryColor: undefined,
            logoUrl: undefined
          });
        }
      } catch (err: any) {
        console.error('Failed to load merchant data:', err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authMerchant?.id]);

  // Icon picker useEffect - embedded from IconPickerPage
  useEffect(() => {
    const fetchInitialIconData = async () => {
      try {
        await handleIconSearch('coffee');
      } catch (err: any) {
        console.error('Failed to load icon data:', err);
        setIconError(`Failed to load icon data: ${err.message || 'Unknown error'}`);
      } finally {
        setIconLoading(false);
      }
    };

    if (authState?.merchant?.id) {
      fetchInitialIconData();
    }
  }, [authState?.merchant?.id]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleColorChange = (field: 'primaryColor' | 'secondaryColor', value: string) => {
    setPunchCardStyle(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleImageUploadCompleted = (publicImageUrl: string) => {
    setPunchCardStyle(prev => ({
      ...prev,
      logoUrl: publicImageUrl
    }));
    
    setSuccess('Logo uploaded successfully!');
    setError(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleImageRemove = async () => {
    if (!merchant) return;
    
    try {
      await apiClient.updateMerchantDefaultPunchCardLogo(merchant.id, '');
      
      setPunchCardStyle(prev => ({
        ...prev,
        logoUrl: undefined
      }));
      
      setSuccess('Logo removed successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Failed to remove logo');
    }
  };

  const handleImageError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleStyleSave = async () => {
    if (!merchant) return;
    
    setStyleLoading(true);
    try {
      const styleData: { primaryColor?: string; secondaryColor?: string } = {};
      
      if (punchCardStyle.primaryColor) {
        styleData.primaryColor = punchCardStyle.primaryColor;
      }
      if (punchCardStyle.secondaryColor) {
        styleData.secondaryColor = punchCardStyle.secondaryColor;
      }
      
      await apiClient.createOrUpdateMerchantDefaultStyle(merchant.id, styleData);
      setSuccess('Design saved successfully!');
      setError(null);
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to save design');
    } finally {
      setStyleLoading(false);
    }
  };

  // Icon picker handlers - embedded from IconPickerPage
  const handleIconSearch = async (query: string = searchTerm) => {
    if (!query.trim()) return;
    
    setIconError(null);
    
    try {
      const result = await apiClient.searchIcons(query, 1, 50);
      setFoundIcons(result.icons);
      setTotalIcons(result.total);
    } catch (err: any) {
      setIconError(`Search failed: ${err.message}`);
      setFoundIcons([]);
      setTotalIcons(0);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleIconSearch(value);
    }, 600);
  };

  const handleIconSelect = (icon: IconDto) => {
    setIconStates(prev => ({
      ...prev,
      [activeIconType]: {
        ...prev[activeIconType],
        icon
      }
    }));
  };

  const handlePropertiesChange = (properties: SVGProperties) => {
    setIconStates(prev => ({
      ...prev,
      [activeIconType]: {
        ...prev[activeIconType],
        properties
      }
    }));
  };

  const handleSaveIconCustomization = async () => {
    if (!iconStates.filled.icon || !iconStates.unfilled.icon) {
      setIconError('Please select both filled and unfilled icons before saving');
      return;
    }

    if (!merchant) {
      setIconError('Merchant not found');
      return;
    }

    setIconSaving(true);
    setIconError(null);

    try {
      const punchIcons: PunchIconsDto = {
        filled: {
          type: 'svg',
          data: {
            svg_raw_content: iconStates.filled.icon.svg_content
          }
        },
        unfilled: {
          type: 'svg',
          data: {
            svg_raw_content: iconStates.unfilled.icon.svg_content
          }
        }
      };

      console.log('Saving punch icons for merchant:', merchant.id, punchIcons);
      
      const result = await apiClient.updateMerchantDefaultPunchIcons(merchant.id, punchIcons);
      
      console.log('Successfully saved punch icons:', result);
      
      setIconSuccess('Icon customization saved successfully!');
      setIconError(null);
      setTimeout(() => setIconSuccess(null), 5000);
    } catch (err: any) {
      console.error('Failed to save punch icons:', err);
      setIconError(`Failed to save customization: ${err.message}`);
      setIconSuccess(null);
    } finally {
      setIconSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!merchant) {
    return (
      <Box>
        <Alert severity="error">{error || 'Merchant not found'}</Alert>
      </Box>
    );
  }

  const activeIcon = iconStates[activeIconType];
  const canSaveIcons = !!iconStates.filled.icon && !!iconStates.unfilled.icon;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: '#f5f5dc',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px #3e2723',
          fontSize: isMobile ? '1.75rem' : '2.125rem',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Palette />
        Design
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 1.5 }}>
          {success}
        </Alert>
      )}

      <Card
        sx={{
          backgroundColor: '#f5f5dc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          mb: 2,
        }}
      >
        <CardContent sx={{ padding: isMobile ? '16px' : '20px', '&:last-child': { paddingBottom: isMobile ? '16px' : '20px' } }}>
          <Typography
            variant="h6"
            sx={{
              color: '#3e2723',
              fontWeight: 'bold',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Punch Card Design
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 1 }}>
              Punch Card Logo
            </Typography>
            <Box>
              <ImagePicker
                currentlyDisplayedImageUrl={punchCardStyle.logoUrl}
                onImageUploadCompleted={handleImageUploadCompleted}
                onCurrentImageDeleted={handleImageRemove}
                onErrorOccurred={handleImageError}

                uploadConfig={{
                  merchantId: merchant.id,
                  filename: 'punch-card-default-logo.webp',
                  postUploadApiCall: async (merchantId, publicUrl) => {
                    await apiClient.updateMerchantDefaultPunchCardLogo(merchantId, publicUrl);
                  }
                }}
                changeButtonLabel="Change Logo"
                fileRequirementsText="This logo will appear on punch cards (optional, max 5MB)"
                showCropInterface={true}
                showShapeToggle={true}
                logoShape="circle"
              />
            </Box>

          </Box>

          <Box 
            sx={{ 
              borderTop: '1px solid #d7ccc8',
              pt: 3,
              mb: 3,
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 1 }}>
              Colors
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#5d4037', mb: 1, fontWeight: 500 }}>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    type="color"
                    value={punchCardStyle.primaryColor || '#000000'}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    sx={{ width: 60 }}
                    inputProps={{ style: { height: 40, padding: 0 } }}
                  />
                  <TextField
                    value={punchCardStyle.primaryColor || ''}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    placeholder="Primary color"
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#5d4037', mb: 1, fontWeight: 500 }}>
                  Secondary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    type="color"
                    value={punchCardStyle.secondaryColor || '#000000'}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    sx={{ width: 60 }}
                    inputProps={{ style: { height: 40, padding: 0 } }}
                  />
                  <TextField
                    value={punchCardStyle.secondaryColor || ''}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    placeholder="Secondary color"
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleStyleSave}
            disabled={styleLoading || !hasChanges}
            fullWidth
            sx={{
              backgroundColor: '#3e2723',
              '&:hover': { backgroundColor: '#5d4037' },
              py: 1.5,
            }}
          >
            {styleLoading ? 'Saving...' : 'Save Colors'}
          </Button>
        </CardContent>
      </Card>

      {/* Icon Customization Block - embedded from IconPickerPage */}
      <Card
        sx={{
          backgroundColor: '#f5f5dc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ padding: isMobile ? '16px' : '20px', '&:last-child': { paddingBottom: isMobile ? '16px' : '20px' } }}>
          <Typography
            variant="h6"
            sx={{
              color: '#3e2723',
              fontWeight: 'bold',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Punch Card Icons
          </Typography>

          {iconError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {iconError}
            </Alert>
          )}

          {iconSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {iconSuccess}
            </Alert>
          )}

          {iconLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <IconPreviewSection iconStates={iconStates} />

              <Card sx={{ backgroundColor: '#f8f8f8', mb: 3, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Customizing:
                    </Typography>
                    <ToggleButtonGroup
                      value={activeIconType}
                      exclusive
                      onChange={(_, newType) => newType && setActiveIconType(newType)}
                      size="small"
                      sx={{
                        '& .MuiToggleButton-root': {
                          px: 2,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          border: '2px solid #d0d0d0',
                          borderRadius: '6px',
                          '&.Mui-selected': {
                            backgroundColor: '#5d4037',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#3e2723',
                            },
                          },
                          '&:not(.Mui-selected)': {
                            backgroundColor: 'white',
                            color: '#666',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value="filled">
                        Filled Icons
                      </ToggleButton>
                      <ToggleButton value="unfilled">
                        Unfilled Icons
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <IconGrid 
                  icons={foundIcons}
                  totalIcons={totalIcons}
                  searchTerm={searchTerm}
                  selectedIconId={activeIcon?.icon?.id || null}
                  onSearchChange={handleSearchChange}
                  onIconSelect={handleIconSelect}
                />

                <IconCustomizationPanel 
                  activeIconType={activeIconType}
                  activeIconState={activeIcon}
                  canSave={canSaveIcons}
                  onPropertiesChange={handlePropertiesChange}
                  onSave={handleSaveIconCustomization}
                  isSaving={iconSaving}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 
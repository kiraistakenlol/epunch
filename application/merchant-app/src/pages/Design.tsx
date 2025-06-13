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
} from '@mui/material';
import { Palette } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';
import { ImagePicker } from '../components/ImagePicker';
import { apiClient } from 'e-punch-common-ui';
import { MerchantDto } from 'e-punch-common-core';

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
  const [merchant, setMerchant] = useState<MerchantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [punchCardStyle, setPunchCardStyle] = useState<PunchCardStyle>({});

  const [styleLoading, setStyleLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
    
    // Handle success message here instead of separate callback
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

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto' }}>
      <Typography
        variant="h4"
        sx={{
          color: '#f5f5dc',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px #3e2723',
          fontSize: isMobile ? '1.5rem' : '2rem',
          mb: 2,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
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
            <Box 
              sx={{ 
                '& img': {
                  width: { xs: '225px !important', sm: '300px !important', md: '375px !important' },
                  height: { xs: '225px !important', sm: '300px !important', md: '375px !important' },
                  objectFit: 'contain'
                }
              }}
            >
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
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#5d4037', mb: 0.5, display: 'block' }}>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
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
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#5d4037', mb: 0.5, display: 'block' }}>
                  Secondary Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
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
    </Box>
  );
}; 
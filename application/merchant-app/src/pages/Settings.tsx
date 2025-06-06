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
  IconButton,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { ImagePicker } from '../components/ImagePicker';
import { apiClient } from 'e-punch-common-ui';
import { MerchantDto, UpdateMerchantDto } from 'e-punch-common-core';
import { updateMerchant } from '../store/authSlice';

export const Settings: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const authMerchant = useAppSelector((state: any) => state.auth.merchant);
  const [merchant, setMerchantData] = useState<MerchantDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: '',
    address: '',
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!authMerchant?.id) {
        setError('Merchant not authenticated');
        setLoading(false);
        return;
      }

      try {
        const merchantData = await apiClient.getMerchantById(authMerchant.id);
        setMerchantData(merchantData);
        setFormData({
          name: merchantData.name,
          login: merchantData.email, // Using email as login for display
          password: '',
          address: merchantData.address || '',
        });
      } catch (err) {
        setError('Failed to load merchant data');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [authMerchant?.id]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageReady = async (imageBlob: Blob, _imageDataUrl: string) => {
    if (!merchant) return;
    
    try {
      // Upload to S3
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchant.id, 'merchant_logo.webp');
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: imageBlob,
        headers: { 'Content-Type': 'image/webp' },
      });

      if (!response.ok) throw new Error('Upload failed');

      // Update merchant with logo URL
      const updateData: UpdateMerchantDto = { logoUrl: publicUrl };
      const updatedMerchant = await apiClient.updateMerchant(merchant.id, updateData);
      
      // Update local state and Redux
      setMerchantData(updatedMerchant);
      dispatch(updateMerchant(updatedMerchant));
      
      setSuccess('Logo uploaded successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Failed to upload logo');
    }
  };

  const handleImageRemove = async () => {
    if (!merchant) return;
    
    try {
      const updateData: UpdateMerchantDto = { logoUrl: '' };
      const updatedMerchant = await apiClient.updateMerchant(merchant.id, updateData);
      
      // Update local state and Redux
      setMerchantData(updatedMerchant);
      dispatch(updateMerchant(updatedMerchant));
      
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

  const handleSave = async () => {
    if (!merchant) return;
    
    setSaving(true);
    try {
      const updateData: UpdateMerchantDto = {
        name: formData.name,
        login: formData.login,
        address: formData.address || undefined,
      };
      
      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      const updatedMerchant = await apiClient.updateMerchant(merchant.id, updateData);
      
      // Update local state and Redux
      setMerchantData(updatedMerchant);
      dispatch(updateMerchant(updatedMerchant));
      
      setIsEditing(false);
      setSuccess('Information updated successfully!');
      setError(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(`Failed to update information: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!merchant) return;
    
    // Reset form data
    setFormData({
      name: merchant.name,
      login: merchant.email,
      password: '',
      address: merchant.address || '',
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography
        variant="h4"
        sx={{
          color: '#f5f5dc',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px #3e2723',
          fontSize: isMobile ? '1.5rem' : '2rem',
          mb: 2,
          textAlign: 'center',
        }}
      >
        Settings
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#3e2723',
                fontWeight: 'bold',
              }}
            >
              Merchant Information
            </Typography>
            {!isEditing && (
              <IconButton
                onClick={() => setIsEditing(true)}
                sx={{ color: '#3e2723' }}
              >
                <Edit />
              </IconButton>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 1 }}>
              Logo
            </Typography>
            <ImagePicker
              currentImageUrl={merchant.logoUrl}
              onImageReady={handleImageReady}
              onImageRemove={handleImageRemove}
              onError={handleImageError}
              uploadButtonText="Upload Logo"
              changeButtonText="Change Logo"
              helperText="Merchant logo (optional, max 5MB)"
            />
          </Box>

          <Box 
            sx={{ 
              borderTop: '1px solid #d7ccc8',
              pt: 3,
            }}
          >
            {isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Login"
                  value={formData.login}
                  onChange={(e) => handleInputChange('login', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  fullWidth
                  helperText="Leave empty to keep current password"
                />
                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      backgroundColor: '#3e2723',
                      '&:hover': { backgroundColor: '#5d4037' }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ color: '#5d4037' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Name
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      {merchant.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Slug
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      {merchant.slug}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                    Login
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5d4037' }}>
                    {merchant.email}
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      {merchant.address || 'Not provided'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      {new Date(merchant.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { UpdateMerchantDto, MerchantDto } from 'e-punch-common-core';

interface FormData {
  name: string;
  address: string;
  slug: string;
  login: string;
  password: string;
}

interface FormErrors {
  name?: string;
  address?: string;
  slug?: string;
  login?: string;
  password?: string;
}

export const MerchantEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [merchant, setMerchant] = useState<MerchantDto | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    slug: '',
    login: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    if (id) {
      fetchMerchant();
    }
  }, [id]);

  const showSnackbar = (message: string, severity: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchMerchant = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const merchantData = await apiClient.getMerchantById(id);
      setMerchant(merchantData);
      setFormData({
        name: merchantData.name,
        address: merchantData.address || '',
        slug: merchantData.slug,
        login: merchantData.email,
        password: '',
      });
    } catch (err: any) {
      console.error('Failed to fetch merchant:', err);
      showSnackbar(err.message || 'Failed to load merchant', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/merchants');
  };

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.login.trim()) {
      newErrors.login = 'Login is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const updateData: UpdateMerchantDto = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        slug: formData.slug.trim(),
        login: formData.login.trim(),
      };

      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      await apiClient.updateMerchant(id, updateData);
      showSnackbar('Merchant updated successfully', 'success');
      
      setTimeout(() => {
        navigate('/merchants');
      }, 1500);
      
    } catch (err: any) {
      console.error('Failed to update merchant:', err);
      showSnackbar(err.message || 'Failed to update merchant', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!merchant) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Merchant not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            backgroundColor: '#5d4037',
            color: '#f5f5dc',
            '&:hover': { backgroundColor: '#6d4c41' },
          }}
        >
          Back to Merchants
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h4"
          sx={{
            color: '#f5f5dc',
            fontWeight: 'bold',
            textShadow: '1px 1px 1px #3e2723',
          }}
        >
          Edit Merchant
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderColor: '#f5f5dc',
            color: '#f5f5dc',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(245, 245, 220, 0.1)',
            },
          }}
        >
          Back to Merchants
        </Button>
      </Box>

      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Name *"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                disabled={isSubmitting}
              />

              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={handleInputChange('address')}
                error={!!errors.address}
                helperText={errors.address}
                disabled={isSubmitting}
              />

              <TextField
                label="Slug *"
                variant="outlined"
                fullWidth
                value={formData.slug}
                onChange={handleInputChange('slug')}
                error={!!errors.slug}
                helperText={errors.slug || 'Used in URLs and must be unique'}
                disabled={isSubmitting}
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />

              <TextField
                label="Login *"
                variant="outlined"
                fullWidth
                value={formData.login}
                onChange={handleInputChange('login')}
                error={!!errors.login}
                helperText={errors.login || 'Used for merchant app authentication'}
                disabled={isSubmitting}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Leave blank to keep current password (minimum 6 characters if changed)'}
                disabled={isSubmitting}
              />

              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  sx={{
                    borderColor: '#5d4037',
                    color: '#5d4037',
                    '&:hover': {
                      borderColor: '#3e2723',
                      backgroundColor: 'rgba(93, 64, 55, 0.1)',
                    },
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveIcon />}
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                    '&:disabled': {
                      backgroundColor: 'rgba(93, 64, 55, 0.5)',
                      color: 'rgba(245, 245, 220, 0.5)',
                    },
                  }}
                >
                  {isSubmitting ? 'Updating...' : 'Update Merchant'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 
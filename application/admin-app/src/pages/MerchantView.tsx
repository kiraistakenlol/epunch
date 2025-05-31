import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { MerchantDto } from 'e-punch-common-core';

export const MerchantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [merchant, setMerchant] = useState<MerchantDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleEdit = () => {
    navigate(`/merchants/${id}/edit`);
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
          Merchant Details
        </Typography>
        
        <Box display="flex" gap={2}>
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
            Back
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              backgroundColor: '#5d4037',
              color: '#f5f5dc',
              '&:hover': { backgroundColor: '#6d4c41' },
            }}
          >
            Edit Merchant
          </Button>
        </Box>
      </Box>

      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <BusinessIcon sx={{ fontSize: 40, color: '#5d4037', mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                {merchant.name}
              </Typography>
              <Chip
                label={merchant.slug}
                variant="outlined"
                size="small"
                sx={{ mt: 1, borderColor: '#5d4037', color: '#5d4037' }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(93, 64, 55, 0.2)' }} />

          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" alignItems="center">
              <EmailIcon sx={{ color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {merchant.email || '—'}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <LocationIcon sx={{ color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {merchant.address || '—'}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <LinkIcon sx={{ color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Slug
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                  {merchant.slug}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <CalendarIcon sx={{ color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {new Date(merchant.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
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
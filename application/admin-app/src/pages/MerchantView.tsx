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
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  People as UsersIcon,
  CreditCard as PunchCardIcon,
  Loyalty as LoyaltyIcon,
  Analytics as AnalyticsIcon,
  QrCode as QrCodeIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { apiClient, SystemStatistics } from 'e-punch-common-ui';
import { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { generateMerchantQRPDF } from '../utils/pdfGenerator';

export const MerchantView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [merchant, setMerchant] = useState<MerchantDto | null>(null);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [merchantStats, setMerchantStats] = useState<SystemStatistics['merchants']['list'][0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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
      fetchLoyaltyPrograms();
      fetchMerchantStats();
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

  const fetchLoyaltyPrograms = async () => {
    if (!id) return;
    
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(id);
      setLoyaltyPrograms(programs);
    } catch (err: any) {
      console.error('Failed to fetch loyalty programs:', err);
      showSnackbar(err.message || 'Failed to load loyalty programs', 'error');
    }
  };

  const fetchMerchantStats = async () => {
    if (!id) return;
    
    try {
      setStatsLoading(true);
      const systemStats = await apiClient.getSystemStatistics();
      const merchantStat = systemStats.merchants.list.find(m => m.id === id);
      setMerchantStats(merchantStat || null);
    } catch (err: any) {
      console.error('Failed to fetch merchant statistics:', err);
      showSnackbar(err.message || 'Failed to load merchant statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/merchants');
  };

  const handleEdit = () => {
    navigate(`/merchants/${id}/edit`);
  };

  const handleViewPrintableQR = async () => {
    if (merchant) {
      try {
        await generateMerchantQRPDF(merchant);
        showSnackbar('PDF generated successfully!', 'success');
      } catch (error: any) {
        console.error('Failed to generate PDF:', error);
        showSnackbar('Failed to generate PDF', 'error');
      }
    }
  };

  const getStatCard = (title: string, value: number | string, icon: React.ReactNode, color: string) => (
    <Card sx={{ backgroundColor: '#f5f5dc', height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          {React.cloneElement(icon as React.ReactElement, { sx: { color, fontSize: 28 } })}
          <Typography variant="h6" component="h3" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

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

      {/* Merchant Information */}
      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 4 }}>
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

      {/* Welcome QR Code */}
      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box display="flex" alignItems="center">
              <QrCodeIcon sx={{ fontSize: 40, color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                  Welcome QR Code
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customers can scan this code to instantly get punch cards for all your loyalty programs
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={handleViewPrintableQR}
              sx={{
                backgroundColor: '#5d4037',
                color: '#f5f5dc',
                '&:hover': { backgroundColor: '#6d4c41' },
              }}
            >
              Generate PDF
            </Button>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center">
            <Box display="flex" justifyContent="center">
              <Box
                sx={{
                  p: 3,
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e0e0e0',
                }}
              >
                <QRCodeSVG 
                  value={`https://narrow-ai-epunch.vercel.app?merchant=${merchant.slug}`}
                  size={200}
                  level="M"
                  includeMargin={true}
                  fgColor="#3e2723"
                  bgColor="#ffffff"
                />
              </Box>
            </Box>
            
            <Box flex={1}>
              <Box mt={3} p={2} sx={{ backgroundColor: 'rgba(93, 64, 55, 0.1)', borderRadius: '8px' }}>
                <Typography 
                  variant="body2" 
                  component="a"
                  href={`https://narrow-ai-epunch.vercel.app?merchant=${merchant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    fontFamily: 'monospace', 
                    wordBreak: 'break-all', 
                    color: '#5d4037',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: '#3e2723',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  https://narrow-ai-epunch.vercel.app?merchant={merchant.slug}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Merchant Statistics */}
      <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon /> Merchant Analytics
      </Typography>
      
      {statsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px" mb={4}>
          <CircularProgress sx={{ color: '#f5f5dc' }} />
        </Box>
      ) : (
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {getStatCard('Punch Cards', merchantStats?.punchCardCount || 0, <PunchCardIcon />, '#1976d2')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {getStatCard('Active Users', merchantStats?.userCount || 0, <UsersIcon />, '#2e7d32')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {getStatCard('Loyalty Programs', merchantStats?.loyaltyProgramCount || 0, <LoyaltyIcon />, '#7b1fa2')}
          </Grid>
        </Grid>
      )}

      {/* Loyalty Programs */}
      {loyaltyPrograms.length > 0 && (
        <>
          <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LoyaltyIcon /> Loyalty Programs
          </Typography>
          
          <Card sx={{ backgroundColor: '#f5f5dc', mb: 4 }}>
            <CardContent>
              {loyaltyPrograms.map((program) => (
                <Box key={program.id} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      {program.name}
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Chip
                        size="small"
                        label={`${program.requiredPunches} punches`}
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      />
                      <Chip
                        size="small"
                        label={program.isActive ? 'Active' : 'Inactive'}
                        sx={{
                          backgroundColor: program.isActive ? '#e8f5e8' : '#ffebee',
                          color: program.isActive ? '#2e7d32' : '#d32f2f',
                        }}
                      />
                    </Box>
                  </Box>
                  {program.description && (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {program.description}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#5d4037', fontWeight: 'medium' }}>
                    Reward: {program.rewardDescription}
                  </Typography>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </>
      )}

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
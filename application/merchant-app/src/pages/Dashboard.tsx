import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Loyalty,
  QrCodeScanner,
  Add as AddIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../store/hooks';

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPrograms = async () => {
      if (!merchantId) return;
      
      try {
        const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
        setLoyaltyPrograms(programs);
      } catch (error) {
        console.error('Failed to fetch loyalty programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyPrograms();
  }, [merchantId]);

  const handleNavigateToScanner = () => {
    navigate('/scanner');
  };

  const handleNavigateToLoyaltyPrograms = () => {
    navigate('/loyalty-programs');
  };

  const handleCreateLoyaltyProgram = () => {
    navigate('/loyalty-programs/create');
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#f5f5dc',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px #3e2723',
          marginBottom: 4,
          fontSize: isMobile ? '1.75rem' : '2.125rem',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        Merchant Dashboard
      </Typography>

      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={handleNavigateToLoyaltyPrograms}
            sx={{
              background: 'linear-gradient(135deg, #f5f5dc 0%, #efebe9 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: isMobile ? 'auto' : '200px',
              '&:hover': {
                transform: isMobile ? 'none' : 'translateY(-4px)',
                boxShadow: isMobile ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <CardContent
              sx={{
                padding: isMobile ? 2 : 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <Loyalty sx={{ fontSize: isMobile ? 28 : 32, color: '#5d4037', marginRight: 2 }} />
                <Typography variant="h6" component="div" sx={{ color: '#3e2723', fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                  Loyalty Programs
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateLoyaltyProgram();
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': {
                      backgroundColor: '#6d4c41',
                    },
                    width: 32,
                    height: 32,
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  color: '#5d4037',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  fontSize: isMobile ? '2.5rem' : '3.75rem',
                }}
              >
                {isLoading ? '...' : loyaltyPrograms.length}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#795548',
                  textAlign: 'center',
                  fontWeight: 500,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                Active programs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={handleNavigateToScanner}
            sx={{
              background: 'linear-gradient(135deg, #f5f5dc 0%, #efebe9 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: isMobile ? 'auto' : '200px',
              '&:hover': {
                transform: isMobile ? 'none' : 'translateY(-4px)',
                boxShadow: isMobile ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 8px 16px rgba(0, 0, 0, 0.4)',
              },
            }}
          >
            <CardContent
              sx={{
                padding: isMobile ? 2 : 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <QrCodeScanner sx={{ fontSize: isMobile ? 28 : 32, color: '#5d4037', marginRight: 2 }} />
                <Typography variant="h6" component="div" sx={{ color: '#3e2723', fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                  QR Scanner
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#795548',
                  lineHeight: 1.6,
                  marginTop: 2,
                  textAlign: isMobile ? 'center' : 'left',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                Scan customer QR codes to add punches or redeem rewards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 
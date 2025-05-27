import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../store/hooks';

export const LoyaltyPrograms: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoyaltyPrograms();
  }, [merchantId]);

  const fetchLoyaltyPrograms = async () => {
    if (!merchantId) {
      setError('Merchant not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      setLoyaltyPrograms(programs);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch loyalty programs:', err);
      setError(err.message || 'Failed to load loyalty programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/loyalty-programs/create');
  };

  const handleEdit = (id: string) => {
    navigate(`/loyalty-programs/${id}/edit`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!merchantId) return;
    
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await apiClient.deleteLoyaltyProgram(merchantId, id);
        await fetchLoyaltyPrograms(); // Refresh the list
      } catch (err: any) {
        console.error('Failed to delete loyalty program:', err);
        setError(err.message || 'Failed to delete loyalty program');
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 2 : 0}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#f5f5dc',
            fontWeight: 'bold',
            textShadow: '1px 1px 1px #3e2723',
            fontSize: isMobile ? '1.75rem' : '2.125rem',
          }}
        >
          Loyalty Programs
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            backgroundColor: '#5d4037',
            color: '#f5f5dc',
            '&:hover': {
              backgroundColor: '#6d4c41',
            },
            width: isMobile ? '100%' : 'auto',
          }}
        >
          Create Program
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loyaltyPrograms.length === 0 ? (
        <Card sx={{ backgroundColor: '#f5f5dc', textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No loyalty programs yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your first loyalty program to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                backgroundColor: '#5d4037',
                color: '#f5f5dc',
                '&:hover': {
                  backgroundColor: '#6d4c41',
                },
              }}
            >
              Create Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {loyaltyPrograms.map((program) => (
            <Card
              key={program.id}
              sx={{
                backgroundColor: '#f5f5dc',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-2px)',
                  boxShadow: isMobile ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 6px 12px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                  flexDirection={isMobile ? 'column' : 'row'}
                  gap={isMobile ? 1 : 0}
                >
                  <Box flex={1}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: '#3e2723',
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    >
                      {program.name}
                    </Typography>
                    
                    <Chip
                      label={program.isActive ? 'Active' : 'Inactive'}
                      color={program.isActive ? 'success' : 'default'}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  <Box display="flex" gap={1} flexShrink={0}>
                    <IconButton
                      onClick={() => handleEdit(program.id)}
                      sx={{
                        backgroundColor: '#8d6e63',
                        color: '#f5f5dc',
                        '&:hover': {
                          backgroundColor: '#6d4c41',
                        },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => handleDelete(program.id, program.name)}
                      sx={{
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#c62828',
                        },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {program.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {program.description}
                  </Typography>
                )}

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={isMobile ? 'column' : 'row'}
                  gap={isMobile ? 1 : 0}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#5d4037',
                      fontWeight: 'bold',
                    }}
                  >
                    {program.requiredPunches} punches required
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#795548',
                      fontStyle: 'italic',
                      textAlign: isMobile ? 'center' : 'right',
                    }}
                  >
                    Reward: {program.rewardDescription}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}; 
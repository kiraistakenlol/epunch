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
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(93, 64, 55, 0.1)',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-1px)',
                  boxShadow: isMobile ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 8px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ padding: isMobile ? '16px' : '20px', '&:last-child': { paddingBottom: isMobile ? '16px' : '20px' } }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1.5}
                >
                  <Box flex={1} mr={2}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          color: '#3e2723',
                          fontWeight: 600,
                          fontSize: isMobile ? '1.1rem' : '1.25rem',
                          lineHeight: 1.2,
                        }}
                      >
                        {program.name}
                      </Typography>
                      
                      <Chip
                        label={program.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          height: '20px',
                          fontSize: '0.75rem',
                          backgroundColor: program.isActive ? '#e8f5e8' : '#f5f5f5',
                          color: program.isActive ? '#2e7d32' : '#757575',
                          border: program.isActive ? '1px solid #c8e6c9' : '1px solid #e0e0e0',
                        }}
                      />
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#5d4037',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                      }}
                    >
                      {program.requiredPunches} punches → {program.rewardDescription}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" gap={0.5} flexShrink={0}>
                    <IconButton
                      onClick={() => handleEdit(program.id)}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(93, 64, 55, 0.08)',
                        color: '#5d4037',
                        '&:hover': {
                          backgroundColor: 'rgba(93, 64, 55, 0.15)',
                        },
                        width: 32,
                        height: 32,
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      onClick={() => handleDelete(program.id, program.name)}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                        color: '#d32f2f',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.15)',
                        },
                        width: 32,
                        height: 32,
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {program.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#795548',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      mt: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {program.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { CreateLoyaltyProgramDto } from 'e-punch-common-core';
import { useAppSelector } from '../store/hooks';

export const LoyaltyProgramCreate: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const merchantId = useAppSelector(state => state.auth.merchant?.id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredPunches: 10,
    rewardDescription: '',
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Program name is required';
    }
    
    if (!formData.rewardDescription.trim()) {
      newErrors.rewardDescription = 'Reward description is required';
    }
    
    if (formData.requiredPunches < 1) {
      newErrors.requiredPunches = 'Required punches must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !merchantId) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const createData: CreateLoyaltyProgramDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        requiredPunches: formData.requiredPunches,
        rewardDescription: formData.rewardDescription.trim(),
        isActive: formData.isActive,
      };
      
      await apiClient.createLoyaltyProgram(merchantId, createData);
      navigate('/loyalty-programs');
    } catch (err: any) {
      console.error('Failed to create loyalty program:', err);
      setSubmitError(err.message || 'Failed to create loyalty program');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'requiredPunches' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSwitchChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/loyalty-programs')}
          sx={{
            color: '#f5f5dc',
            '&:hover': {
              backgroundColor: 'rgba(245, 245, 220, 0.1)',
            },
          }}
        >
          Back
        </Button>
        
        <Typography
          variant="h4"
          sx={{
            color: '#f5f5dc',
            fontWeight: 'bold',
            textShadow: '1px 1px 1px #3e2723',
            fontSize: isMobile ? '1.75rem' : '2.125rem',
          }}
        >
          Create Loyalty Program
        </Typography>
      </Box>

      <Card
        sx={{
          backgroundColor: '#f5f5dc',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <CardContent sx={{ padding: isMobile ? 2 : 3 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Program Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              required
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#8d6e63',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5d4037',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5d4037',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#5d4037',
                  '&.Mui-focused': {
                    color: '#5d4037',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              value={formData.description}
              onChange={handleInputChange('description')}
              margin="normal"
              multiline
              rows={3}
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#8d6e63',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5d4037',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5d4037',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#5d4037',
                  '&.Mui-focused': {
                    color: '#5d4037',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Required Punches"
              type="number"
              value={formData.requiredPunches}
              onChange={handleInputChange('requiredPunches')}
              error={!!errors.requiredPunches}
              helperText={errors.requiredPunches}
              margin="normal"
              required
              disabled={isSubmitting}
              inputProps={{ min: 1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#8d6e63',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5d4037',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5d4037',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#5d4037',
                  '&.Mui-focused': {
                    color: '#5d4037',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Reward Description"
              value={formData.rewardDescription}
              onChange={handleInputChange('rewardDescription')}
              error={!!errors.rewardDescription}
              helperText={errors.rewardDescription}
              margin="normal"
              multiline
              rows={2}
              required
              disabled={isSubmitting}
              placeholder="e.g., Free coffee, 20% discount, etc."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: '#8d6e63',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5d4037',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5d4037',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#5d4037',
                  '&.Mui-focused': {
                    color: '#5d4037',
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange('isActive')}
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#5d4037',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#5d4037',
                    },
                  }}
                />
              }
              label="Active"
              sx={{
                mt: 2,
                mb: 2,
                '& .MuiFormControlLabel-label': {
                  color: '#5d4037',
                  fontWeight: 'bold',
                },
              }}
            />

            <Box
              display="flex"
              gap={2}
              mt={3}
              flexDirection={isMobile ? 'column' : 'row'}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate('/loyalty-programs')}
                disabled={isSubmitting}
                sx={{
                  borderColor: '#8d6e63',
                  color: '#5d4037',
                  '&:hover': {
                    backgroundColor: 'rgba(93, 64, 55, 0.1)',
                    borderColor: '#5d4037',
                  },
                  flex: isMobile ? 1 : 0,
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  '&:hover': {
                    backgroundColor: '#6d4c41',
                  },
                  '&:disabled': {
                    backgroundColor: '#757575',
                  },
                  flex: isMobile ? 1 : 0,
                }}
              >
                {isSubmitting ? 'Creating...' : 'Create Program'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 
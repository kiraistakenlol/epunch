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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
  Analytics as AnalyticsIcon,
  ExpandMore as ExpandMoreIcon,
  CreditCard as PunchCardIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { UserDto, PunchCardDto, MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';

interface GroupedPunchCard extends PunchCardDto {
  merchant?: MerchantDto;
  loyaltyProgram?: LoyaltyProgramDto;
}

interface LoyaltyProgramGroup {
  loyaltyProgram: LoyaltyProgramDto;
  punchCards: GroupedPunchCard[];
}

interface MerchantGroup {
  merchant: MerchantDto;
  loyaltyProgramGroups: LoyaltyProgramGroup[];
  totalCards: number;
}

export const UserView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<UserDto | null>(null);
  const [punchCards, setPunchCards] = useState<PunchCardDto[]>([]);
  const [merchantGroups, setMerchantGroups] = useState<MerchantGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true);
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
      fetchUser();
      fetchUserPunchCards();
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

  const fetchUser = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const userData = await apiClient.getUserById(id);
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      showSnackbar(err.message || 'Failed to load user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPunchCards = async () => {
    if (!id) return;
    
    try {
      setCardsLoading(true);
      const cards = await apiClient.getUserPunchCards(id);
      setPunchCards(cards);
      await groupPunchCardsByMerchant(cards);
    } catch (err: any) {
      console.error('Failed to fetch punch cards:', err);
      showSnackbar(err.message || 'Failed to load punch cards', 'error');
    } finally {
      setCardsLoading(false);
    }
  };

  const groupPunchCardsByMerchant = async (cards: PunchCardDto[]) => {
    if (cards.length === 0) {
      setMerchantGroups([]);
      return;
    }

    try {
      const loyaltyProgramIds = Array.from(new Set(cards.map(card => card.loyaltyProgramId)));
      const loyaltyPrograms = await apiClient.getLoyaltyPrograms(loyaltyProgramIds);
      
      const merchantIds = Array.from(new Set(loyaltyPrograms.map(program => program.merchant.id)));
      const merchants = await Promise.all(
        merchantIds.map(merchantId => apiClient.getMerchantById(merchantId))
      );
      
      const merchantMap = new Map(merchants.map(merchant => [merchant.id, merchant]));
      const loyaltyProgramMap = new Map(loyaltyPrograms.map(program => [program.id, program]));
      
      const groupedCards: GroupedPunchCard[] = cards.map(card => ({
        ...card,
        loyaltyProgram: loyaltyProgramMap.get(card.loyaltyProgramId),
        merchant: loyaltyProgramMap.get(card.loyaltyProgramId) 
          ? merchantMap.get(loyaltyProgramMap.get(card.loyaltyProgramId)!.merchant.id)
          : undefined,
      }));
      
      const merchantGroups = groupedCards.reduce((acc, card) => {
        if (!card.merchant || !card.loyaltyProgram) return acc;
        
        let merchantGroup = acc.find(group => group.merchant.id === card.merchant!.id);
        if (!merchantGroup) {
          merchantGroup = {
            merchant: card.merchant,
            loyaltyProgramGroups: [],
            totalCards: 0,
          };
          acc.push(merchantGroup);
        }
        
        let loyaltyProgramGroup = merchantGroup.loyaltyProgramGroups.find(
          group => group.loyaltyProgram.id === card.loyaltyProgram!.id
        );
        if (!loyaltyProgramGroup) {
          loyaltyProgramGroup = {
            loyaltyProgram: card.loyaltyProgram,
            punchCards: [],
          };
          merchantGroup.loyaltyProgramGroups.push(loyaltyProgramGroup);
        }
        
        loyaltyProgramGroup.punchCards.push(card);
        merchantGroup.totalCards++;
        
        return acc;
      }, [] as MerchantGroup[]);
      
      merchantGroups.forEach(group => {
        group.loyaltyProgramGroups.sort((a, b) => a.loyaltyProgram.name.localeCompare(b.loyaltyProgram.name));
      });
      
      setMerchantGroups(merchantGroups.sort((a, b) => a.merchant.name.localeCompare(b.merchant.name)));
    } catch (err: any) {
      console.error('Failed to group punch cards:', err);
      showSnackbar('Failed to group punch cards by merchant', 'error');
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'REWARD_READY':
        return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'REWARD_REDEEMED':
        return { backgroundColor: '#fff3e0', color: '#f57c00' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'REWARD_READY':
        return 'Reward Ready';
      case 'REWARD_REDEEMED':
        return 'Redeemed';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="error" gutterBottom>
          User not found
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
          Back to Users
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
          User Details
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
          Back to Users
        </Button>
      </Box>

      {/* User Information */}
      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonIcon sx={{ fontSize: 40, color: '#5d4037', mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                {user.email || 'Anonymous User'}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                {user.superAdmin && (
                  <Chip
                    icon={<AdminIcon />}
                    label="Super Admin"
                    size="small"
                    sx={{ backgroundColor: '#fff3e0', color: '#f57c00', fontWeight: 'bold' }}
                  />
                )}
                <Chip
                  label={user.externalId ? 'Authenticated' : 'Anonymous'}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: '#5d4037', color: '#5d4037' }}
                />
              </Box>
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
                  {user.email || '—'}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <PersonIcon sx={{ color: '#5d4037', mr: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                  {user.id}
                </Typography>
              </Box>
            </Box>

            {user.externalId && (
              <Box display="flex" alignItems="center">
                <AdminIcon sx={{ color: '#5d4037', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    External ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                    {user.externalId}
                  </Typography>
                </Box>
              </Box>
            )}

            {user.createdAt && (
              <Box display="flex" alignItems="center">
                <CalendarIcon sx={{ color: '#5d4037', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Punch Cards Analytics */}
      <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon /> Punch Cards Analytics
      </Typography>
      
      {cardsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px" mb={4}>
          <CircularProgress sx={{ color: '#f5f5dc' }} />
        </Box>
      ) : (
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ backgroundColor: '#f5f5dc', height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <PunchCardIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                    Total Cards
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
                  {punchCards.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ backgroundColor: '#f5f5dc', height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <BusinessIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                    Merchants
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
                  {merchantGroups.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ backgroundColor: '#f5f5dc', height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <PunchCardIcon sx={{ color: '#f57c00', fontSize: 28 }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                    Reward Ready
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
                  {punchCards.filter(card => card.status === 'REWARD_READY').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ backgroundColor: '#f5f5dc', height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <PunchCardIcon sx={{ color: '#7b1fa2', fontSize: 28 }} />
                  <Typography variant="h6" component="h3" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                    Total Punches
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
                  {punchCards.reduce((sum, card) => sum + card.currentPunches, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Punch Cards by Merchant */}
      {merchantGroups.length > 0 && (
        <>
          <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PunchCardIcon /> Punch Cards by Merchant
          </Typography>
          
          {merchantGroups.map((group) => (
            <Accordion 
              key={group.merchant.id}
              sx={{ 
                backgroundColor: '#f5f5dc', 
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: 'rgba(93, 64, 55, 0.05)' }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center" gap={2}>
                    <BusinessIcon sx={{ color: '#5d4037' }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                      {group.merchant.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${group.totalCards} cards`}
                    size="small"
                    sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', mr: 1 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" gap={2}>
                  {group.loyaltyProgramGroups.map((loyaltyGroup) => (
                    <Accordion 
                      key={loyaltyGroup.loyaltyProgram.id}
                      sx={{ 
                        backgroundColor: 'rgba(93, 64, 55, 0.02)', 
                        boxShadow: 'none',
                        border: '1px solid rgba(93, 64, 55, 0.1)',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ 
                          backgroundColor: 'rgba(93, 64, 55, 0.05)',
                          minHeight: '48px',
                          '& .MuiAccordionSummary-content': { my: 1 }
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Box display="flex" alignItems="center" gap={2}>
                            <PunchCardIcon sx={{ color: '#5d4037', fontSize: 20 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                              {loyaltyGroup.loyaltyProgram.name}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={`${loyaltyGroup.punchCards.length} ${loyaltyGroup.punchCards.length === 1 ? 'card' : 'cards'}`}
                              size="small"
                              sx={{ backgroundColor: '#fff3e0', color: '#f57c00' }}
                            />
                            <Typography variant="body2" sx={{ color: '#5d4037', fontWeight: 'medium', mr: 1 }}>
                              Reward: {loyaltyGroup.loyaltyProgram.rewardDescription}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {loyaltyGroup.loyaltyProgram.description && (
                          <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontStyle: 'italic' }}>
                            {loyaltyGroup.loyaltyProgram.description}
                          </Typography>
                        )}
                        <Box display="flex" flexDirection="column" gap={2}>
                          {loyaltyGroup.punchCards.map((card) => (
                            <Card key={card.id} sx={{ backgroundColor: '#fff', border: '1px solid rgba(93, 64, 55, 0.1)' }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#3e2723' }}>
                                    {loyaltyGroup.punchCards.length > 1 ? `Card #${card.id.slice(-8)}` : 'Punch Card'}
                                  </Typography>
                                  <Chip
                                    label={getStatusLabel(card.status)}
                                    size="small"
                                    sx={getStatusColor(card.status)}
                                  />
                                </Box>
                                
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                  <Typography variant="body2" color="text.secondary">
                                    Progress
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {card.currentPunches} / {loyaltyGroup.loyaltyProgram.requiredPunches} punches
                                  </Typography>
                                </Box>
                                
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                  Created: {new Date(card.createdAt).toLocaleDateString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}

      {!cardsLoading && punchCards.length === 0 && (
        <Card sx={{ backgroundColor: '#f5f5dc', textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No punch cards yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This user hasn't created any punch cards yet
            </Typography>
          </CardContent>
        </Card>
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
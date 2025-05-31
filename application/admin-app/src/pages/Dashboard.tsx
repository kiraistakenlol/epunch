import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  Business as BusinessIcon,
  People as UsersIcon,
  CreditCard as PunchCardIcon,
  Loyalty as LoyaltyIcon,
  Analytics as AnalyticsIcon,
  Build as BuildIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { apiClient, SystemStatistics } from 'e-punch-common-ui';
import { useAppSelector } from '../store/hooks';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const adminUser = useAppSelector((state) => state.auth.adminUser);
  
  const [systemStats, setSystemStats] = useState<SystemStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminOperation, setAdminOperation] = useState<string>('');
  const [adminLoading, setAdminLoading] = useState(false);
  
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
    fetchSystemStatistics();
  }, []);

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

  const fetchSystemStatistics = async () => {
    try {
      setStatsLoading(true);
      const stats = await apiClient.getSystemStatistics();
      setSystemStats(stats);
    } catch (err: any) {
      console.error('Failed to fetch system statistics:', err);
      showSnackbar(err.message || 'Failed to load system statistics', 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDemoSetup = () => {
    navigate('/merchant-demo-setup');
  };

  const handleMerchantManagement = () => {
    navigate('/merchants');
  };

  const handleUserManagement = () => {
    navigate('/users');
  };

  const handleOpenAdminDialog = (operation: string) => {
    setAdminOperation(operation);
    setAdminDialogOpen(true);
  };

  const handleCloseAdminDialog = () => {
    setAdminDialogOpen(false);
    setAdminOperation('');
    setSelectedMerchantId('');
  };

  const handleConfirmAdminOperation = async () => {
    if (!adminOperation) return;

    const operationNames = {
      'remove-punch-cards': 'Remove All Punch Cards',
      'remove-users': 'Remove All Users',
      'remove-loyalty-programs': 'Remove All Loyalty Programs',
      'remove-merchants': 'Remove All Merchants',
      'remove-all': 'Remove All Data',
    };

    const confirmMessage = `Are you sure you want to ${operationNames[adminOperation as keyof typeof operationNames]}? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setAdminLoading(true);
      
      let response;
      const merchantToUse = selectedMerchantId || undefined;
      
      switch (adminOperation) {
        case 'remove-punch-cards':
          response = await apiClient.removeAllPunchCards(merchantToUse);
          break;
        case 'remove-users':
          response = await apiClient.removeAllUsers(merchantToUse);
          break;
        case 'remove-loyalty-programs':
          response = await apiClient.removeAllLoyaltyPrograms(merchantToUse);
          break;
        case 'remove-merchants':
          response = await apiClient.removeAllMerchants(merchantToUse);
          break;
        case 'remove-all':
          response = await apiClient.removeAllData(merchantToUse);
          break;
        default:
          throw new Error('Unknown operation');
      }
      
      showSnackbar(`Operation completed: ${response.message}`, 'success');
      handleCloseAdminDialog();
      fetchSystemStatistics();
      
    } catch (err: any) {
      console.error('Admin operation failed:', err);
      showSnackbar(err.message || 'Operation failed', 'error');
    } finally {
      setAdminLoading(false);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#f5f5dc', fontWeight: 'bold', mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#f5f5dc', opacity: 0.9 }}>
            Welcome back, {adminUser?.firstName || adminUser?.email}!
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSystemStatistics}
          disabled={statsLoading}
          sx={{
            borderColor: '#f5f5dc',
            color: '#f5f5dc',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(245, 245, 220, 0.1)',
            },
          }}
        >
          Refresh Stats
        </Button>
      </Box>

      {/* System Statistics */}
      <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon /> System Overview
      </Typography>
      
      {statsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px" mb={4}>
          <CircularProgress sx={{ color: '#f5f5dc' }} />
        </Box>
      ) : (
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {getStatCard('Merchants', systemStats?.merchants.total || 0, <BusinessIcon />, '#5d4037')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {getStatCard('Total Users', systemStats?.users.total || 0, <UsersIcon />, '#2e7d32')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {getStatCard('Punch Cards', systemStats?.punchCards.total || 0, <PunchCardIcon />, '#1976d2')}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            {getStatCard('Total Punches', systemStats?.punches.total || 0, <LoyaltyIcon />, '#7b1fa2')}
          </Grid>
        </Grid>
      )}

      {/* Punch Cards Breakdown */}
      {systemStats && systemStats.punchCards.total > 0 && (
        <Card sx={{ backgroundColor: '#f5f5dc', mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 2 }}>
              Punch Cards Breakdown
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Active: ${systemStats.punchCards.active}`}
                sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}
              />
              <Chip
                label={`Reward Ready: ${systemStats.punchCards.rewardReady}`}
                sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32', fontWeight: 'bold' }}
              />
              <Chip
                label={`Redeemed: ${systemStats.punchCards.redeemed}`}
                sx={{ backgroundColor: '#fff3e0', color: '#f57c00', fontWeight: 'bold' }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <RocketIcon /> Quick Actions
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              backgroundColor: '#f5f5dc',
              border: '2px solid #5d4037',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={handleDemoSetup}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <RocketIcon sx={{ fontSize: 32, color: '#5d4037' }} />
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Merchant Demo Setup
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      Quick setup for demos and presentations
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                  }}
                >
                  Setup
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              backgroundColor: '#f5f5dc',
              border: '2px solid #5d4037',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={handleMerchantManagement}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <BusinessIcon sx={{ fontSize: 32, color: '#5d4037' }} />
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Manage Merchants
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      View, create, and edit merchants
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                  }}
                >
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              backgroundColor: '#f5f5dc',
              border: '2px solid #5d4037',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={handleUserManagement}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <UsersIcon sx={{ fontSize: 32, color: '#5d4037' }} />
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Manage Users
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5d4037' }}>
                      View, create, and edit users
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                  }}
                >
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Administration */}
      <Typography variant="h5" sx={{ color: '#f5f5dc', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BuildIcon /> System Administration
      </Typography>
      
      <Card sx={{ backgroundColor: '#f5f5dc', border: '2px solid #d32f2f' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <WarningIcon sx={{ color: '#d32f2f', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                Danger Zone - Data Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                These operations permanently delete data and cannot be undone.
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenAdminDialog('remove-punch-cards')}
              disabled={adminLoading}
            >
              Remove Punch Cards
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenAdminDialog('remove-users')}
              disabled={adminLoading}
            >
              Remove Users
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenAdminDialog('remove-loyalty-programs')}
              disabled={adminLoading}
            >
              Remove Programs
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenAdminDialog('remove-merchants')}
              disabled={adminLoading}
            >
              Remove Merchants
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenAdminDialog('remove-all')}
              disabled={adminLoading}
              sx={{ fontWeight: 'bold' }}
            >
              Remove All Data
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Admin Operation Dialog */}
      <Dialog open={adminDialogOpen} onClose={handleCloseAdminDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#f5f5dc', color: '#d32f2f', fontWeight: 'bold' }}>
          Confirm Data Operation
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5dc', pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#d32f2f' }}>
            ⚠️ This operation will permanently delete data and cannot be undone.
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Scope</InputLabel>
            <Select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              label="Scope"
            >
              <MenuItem value="">All merchants (global operation)</MenuItem>
              {systemStats?.merchants.list.map((merchant) => (
                <MenuItem key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2" sx={{ color: '#5d4037' }}>
            Operation: <strong>{adminOperation.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
            <br />
            Scope: <strong>{selectedMerchantId ? systemStats?.merchants.list.find(m => m.id === selectedMerchantId)?.name : 'All merchants'}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f5f5dc', p: 2 }}>
          <Button onClick={handleCloseAdminDialog} disabled={adminLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAdminOperation}
            variant="contained"
            color="error"
            disabled={adminLoading}
            startIcon={adminLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {adminLoading ? 'Processing...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
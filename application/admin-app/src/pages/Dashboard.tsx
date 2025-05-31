import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const adminUser = useAppSelector((state) => state.auth.adminUser);

  const handleDemoSetup = () => {
    navigate('/merchant-demo-setup');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#f5f5dc', fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ color: '#f5f5dc', mb: 3 }}>
        Welcome back, {adminUser?.firstName || adminUser?.email}!
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
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
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={3}>
                  <RocketIcon sx={{ fontSize: 48, color: '#5d4037' }} />
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#3e2723', fontWeight: 'bold' }}>
                      Merchant Demo Setup
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#5d4037' }}>
                      Quickly set up a new merchant with pre-configured loyalty programs for demos and sales presentations.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                    px: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                  }}
                >
                  Quick Setup
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5dc' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <AdminIcon sx={{ color: '#5d4037' }} />
                <Typography variant="h6" component="h2" sx={{ color: '#3e2723' }}>
                  System Overview
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                Manage merchants, monitor system health, and configure global settings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5dc' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <BusinessIcon sx={{ color: '#5d4037' }} />
                <Typography variant="h6" component="h2" sx={{ color: '#3e2723' }}>
                  Merchant Management
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                Create, edit, and manage merchant accounts and their loyalty programs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5dc' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <AdminIcon sx={{ color: '#5d4037' }} />
                <Typography variant="h6" component="h2" sx={{ color: '#3e2723' }}>
                  Admin Tools
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                Advanced system administration and global configuration options.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 
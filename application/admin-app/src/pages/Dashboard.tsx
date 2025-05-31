import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { useAppSelector } from '../store/hooks';

export const Dashboard: React.FC = () => {
  const adminUser = useAppSelector((state) => state.auth.adminUser);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#f5f5dc', fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ color: '#f5f5dc', mb: 3 }}>
        Welcome back, {adminUser?.firstName || adminUser?.email}!
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5dc' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#3e2723' }}>
                System Overview
              </Typography>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                Manage merchants, monitor system health, and configure global settings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5dc' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#3e2723' }}>
                Merchant Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#5d4037' }}>
                Create, edit, and manage merchant accounts and their loyalty programs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {adminUser?.isSuperAdmin && (
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card sx={{ backgroundColor: '#f5f5dc' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#3e2723' }}>
                  Super Admin Tools
                </Typography>
                <Typography variant="body2" sx={{ color: '#5d4037' }}>
                  Advanced system administration and global configuration options.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}; 
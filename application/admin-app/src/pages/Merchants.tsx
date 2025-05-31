import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppSelector } from '../store/hooks';

export const Merchants: React.FC = () => {
  const adminUser = useAppSelector((state) => state.auth.adminUser);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#f5f5dc', fontWeight: 'bold' }}>
          Merchants
        </Typography>
        
        {adminUser?.isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#5d4037',
              '&:hover': {
                backgroundColor: '#3e2723',
              },
            }}
          >
            Add Merchant
          </Button>
        )}
      </Box>

      <Card sx={{ backgroundColor: '#f5f5dc' }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#3e2723' }}>
            Merchant List
          </Typography>
          <Typography variant="body2" sx={{ color: '#5d4037' }}>
            Merchant management functionality will be implemented here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}; 
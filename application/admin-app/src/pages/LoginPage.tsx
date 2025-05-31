import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      dispatch(loginFailure('Please enter both email and password'));
      return;
    }

    dispatch(loginStart());

    // Hardcoded credentials - admin/0000
    if (email === 'admin' && password === '0000') {
      const adminUser = {
        id: '1',
        email: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isSuperAdmin: true,
      };
      dispatch(loginSuccess(adminUser));
      navigate('/');
    } else {
      dispatch(loginFailure('Invalid credentials. Use admin/0000'));
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#424242'
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, backgroundColor: '#f5f5dc' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
            sx={{ color: '#3e2723', fontWeight: 'bold', mb: 3 }}
          >
            E-PUNCH ADMIN
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              onClose={() => dispatch(clearError())}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              placeholder="admin"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              placeholder="0000"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                backgroundColor: '#5d4037',
                '&:hover': {
                  backgroundColor: '#3e2723',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}; 
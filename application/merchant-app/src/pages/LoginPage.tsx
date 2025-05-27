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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginMerchant } from '../store/authSlice';

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => !!state.auth.merchant);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!login.trim() || !password.trim()) {
      setError('Please enter both login and password');
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(loginMerchant({ login: login.trim(), password })).unwrap();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#424242',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            backgroundColor: '#f5f5dc',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CardContent sx={{ padding: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                color: '#3e2723',
                fontWeight: 'bold',
                marginBottom: 3,
              }}
            >
              E-PUNCH Merchant
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#5d4037',
                marginBottom: 3,
              }}
            >
              Sign in to your merchant account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                margin="normal"
                required
                autoFocus
                disabled={isLoading}
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
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                disabled={isLoading}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  padding: '12px',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#6d4c41',
                  },
                  '&:disabled': {
                    backgroundColor: '#757575',
                  },
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}; 
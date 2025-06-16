import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginMerchant } from '../../store/authSlice';
import { EpunchCard, EpunchInput, EpunchButton, EpunchTypography, EpunchAlert, EpunchBox, EpunchContainer, EpunchPage } from '../../components/foundational';

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
    <EpunchPage centerContent>
      <EpunchContainer size="small">
        <EpunchCard variant="form">
          <EpunchTypography
            variant="pageTitle"
            color="primary"
            textAlign="center"
          >
            E-PUNCH Merchant
          </EpunchTypography>
          
          <EpunchTypography
            variant="body"
            color="secondary"
            textAlign="center"
          >
            Sign in to your merchant account
          </EpunchTypography>

          {error && (
            <EpunchAlert variant="error">
              {error}
            </EpunchAlert>
          )}

          <EpunchBox component="form" onSubmit={handleSubmit}>
            <EpunchInput
              fullWidth
              label="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              autoFocus
              disabled={isLoading}
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />
            
            <EpunchInput
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
              }}
            />

            <EpunchButton
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </EpunchButton>
          </EpunchBox>
        </EpunchCard>
      </EpunchContainer>
    </EpunchPage>
  );
}; 
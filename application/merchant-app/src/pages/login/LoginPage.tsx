import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginMerchant } from '../../store/authSlice';
import { FormContainer, FormField, useFormState, EpunchCard } from '../../components/foundational';
import styles from './LoginPage.module.css';

interface LoginFormData {
  login: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => !!state.auth.merchant);

  const { formData, handleFieldChange, validateForm } = useFormState<LoginFormData>({
    login: '',
    password: ''
  }, {
    login: { required: true },
    password: { required: true }
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      await dispatch(loginMerchant({
        login: formData.login.trim(),
        password: formData.password
      })).unwrap();
      navigate('/');
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <EpunchCard>
          <div className={styles.loginCard}>
            <h1 className={styles.loginTitle}>
              E-PUNCH Merchant
            </h1>

            <p className={styles.loginSubtitle}>
              Sign in to your merchant account
            </p>

            <FormContainer
              onSubmit={handleSubmit}
              onCancel={() => { }} // Not used when showCancelButton=false
              submitText="Sign In"
              submittingText="Signing In..."
              isSubmitting={isLoading}
              error={submitError}
              variant="plain"
              fieldSpacing="lg"
              showCancelButton={false}
            >
              <FormField
                label="Login"
                type="text"
                value={formData.login}
                onChange={handleFieldChange('login')}
                required
                autoFocus
                disabled={isLoading}
                placeholder="Enter your login"
                autoCapitalize="none"
                autoCorrect="off"
              />

              <FormField
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleFieldChange('password')}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </FormContainer>
          </div>
        </EpunchCard>
      </div>
    </div>
  );
}; 
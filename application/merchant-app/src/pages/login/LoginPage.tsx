import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginMerchant, selectIsAuthenticated } from '../../store/authSlice';
import { FormContainer, FormField, useFormState, EpunchCard } from '../../components/foundational';
import styles from './LoginPage.module.css';

interface LoginFormData {
  merchantSlug: string;
  login: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { formData, handleFieldChange, validateForm } = useFormState<LoginFormData>({
    merchantSlug: '',
    login: '',
    password: ''
  }, {
    merchantSlug: { required: true },
    login: { required: true },
    password: { required: true }
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]); // Remove navigate from dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      await dispatch(loginMerchant({
        merchantSlug: formData.merchantSlug.trim(),
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
                label="Merchant Slug"
                type="text"
                value={formData.merchantSlug}
                onChange={handleFieldChange('merchantSlug')}
                required
                autoFocus
                disabled={isLoading}
                placeholder="Enter merchant slug (e.g., cafe-central)"
                autoCapitalize="none"
                autoCorrect="off"
              />

              <FormField
                label="Login"
                type="text"
                value={formData.login}
                onChange={handleFieldChange('login')}
                required
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginMerchant, selectIsAuthenticated } from '../../store/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import styles from './LoginPage.module.css';

interface LoginFormData {
  merchantSlug: string;
  login: string;
  password: string;
}

interface FormErrors {
  merchantSlug?: string;
  login?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    merchantSlug: '',
    login: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.merchantSlug.trim()) {
      newErrors.merchantSlug = 'Merchant slug is required';
    }
    if (!formData.login.trim()) {
      newErrors.login = 'Login is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              E-PUNCH Merchant
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to your merchant account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="merchantSlug">Merchant Slug</Label>
                <Input
                  id="merchantSlug"
                  type="text"
                  value={formData.merchantSlug}
                  onChange={handleFieldChange('merchantSlug')}
                  placeholder="Enter merchant slug (e.g., cafe-central)"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoFocus
                  disabled={isLoading}
                />
                {errors.merchantSlug && (
                  <p className="text-sm text-destructive">{errors.merchantSlug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  type="text"
                  value={formData.login}
                  onChange={handleFieldChange('login')}
                  placeholder="Enter your login"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                />
                {errors.login && (
                  <p className="text-sm text-destructive">{errors.login}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFieldChange('password')}
                  placeholder="Enter your password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
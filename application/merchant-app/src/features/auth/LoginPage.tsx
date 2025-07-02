import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginMerchant, selectIsAuthenticated } from '../../store/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { logoUrl } from 'e-punch-common-ui';

interface LoginFormData {
  merchantSlug: string;
  login: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      merchantSlug: '',
      login: '',
      password: ''
    }
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const watchedFields = form.watch();
  const isFormValid = watchedFields.merchantSlug?.trim() && 
                     watchedFields.login?.trim() && 
                     watchedFields.password;

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]);



  React.useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    setProgress(10);

    try {
      await dispatch(loginMerchant({
        merchantSlug: data.merchantSlug.trim(),
        login: data.login.trim(),
        password: data.password
      })).unwrap();
      
      setProgress(100);
      
      toast.success("Welcome back! 🎉", {
        description: "Successfully signed in to your account",
        duration: 3000,
      });
      
      navigate('/');
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 sm:items-center sm:pt-0 bg-muted/30">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Avatar className="h-12 w-12 bg-transparent">
              <AvatarImage 
                src={logoUrl} 
                alt="ePunch" 
                className="brightness-0 opacity-80 object-contain"
              />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                eP
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-2xl font-light tracking-wide text-foreground mb-2">
            Merchant Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your business
          </p>
        </div>

        <Separator className="mb-8 bg-border" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isLoading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-1" />
                <p className="text-xs text-center text-muted-foreground">Authenticating...</p>
              </div>
            )}

            {submitError && (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-destructive">{submitError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="merchantSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Merchant Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your merchant slug"
                      className="h-11 border-border focus:border-ring focus:ring-0 transition-colors"
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoFocus
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter username"
                      className="h-11 border-border focus:border-ring focus:ring-0 transition-colors"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="h-11 border-border focus:border-ring focus:ring-0 transition-colors pr-10"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors mt-8"
              disabled={isLoading || !isFormValid}
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
        </Form>
      </div>
    </div>
  );
}; 
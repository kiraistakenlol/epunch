import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient, I18nProvider } from 'e-punch-common-ui';
import { ROLES } from 'e-punch-common-core';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { fetchMerchant } from './store/merchantSlice';
import { selectIsAuthenticated } from './store/authSlice';
import { LoginPage } from './pages/login/LoginPage';
import { MerchantOnboardingPage } from './pages/merchant-onboarding/MerchantOnboardingPage';
import UserAppTestPage from './pages/test/UserAppTestPage';
import { DemoPage, FormsDemo, ScannerDemo, DesignDemo } from './components/v2/demo';
import { V2Layout } from './components/v2/layout/V2Layout';
import { V2DashboardPage } from './pages/v2/dashboard/DashboardPage';
import { V2LoyaltyProgramsPage } from './pages/v2/loyalty-programs/LoyaltyProgramsPage';
import { LoyaltyProgramCreatePage } from './pages/v2/loyalty-programs/LoyaltyProgramCreatePage';
import { LoyaltyProgramEditPage } from './pages/v2/loyalty-programs/LoyaltyProgramEditPage';
import { V2DesignPage } from './pages/v2/design/DesignPage';
import { V2ScannerPage } from './pages/v2/scanner/ScannerPage';
import { WelcomeQRPage as V2WelcomeQRPage } from './pages/v2/welcome-qr';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import './styles/global.css';
import { RootState } from './store/store';

// Configure API client
const API_BASE_URL = import.meta.env.VITE_API_URL;
if (API_BASE_URL) {
  configureApiClient(API_BASE_URL);
} else {
  console.error('(MerchantApp) VITE_API_URL is not set. API calls will fail.');
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const RoleProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/scanner" replace />;
  }
  
  return <>{children}</>;
};

const AuthenticatedRedirect: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  
  if (user?.role === ROLES.STAFF) {
    return <Navigate to="/scanner" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Fetch merchant data when authenticated
  React.useEffect(() => {
    if (user?.merchantId) {
      dispatch(fetchMerchant(user.merchantId));
    }
  }, [user?.merchantId, dispatch]);

  return (
    <I18nProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding/:merchantSlug" element={<MerchantOnboardingPage />} />
          <Route path="test/user-app" element={<UserAppTestPage />} />

          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <V2Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AuthenticatedRedirect />} />
            <Route path="dashboard" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <V2DashboardPage />
              </RoleProtectedRoute>
            } />
            <Route path="scanner" element={<V2ScannerPage />} />
            <Route path="loyalty-programs" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <V2LoyaltyProgramsPage />
              </RoleProtectedRoute>
            } />
            <Route path="loyalty-programs/create" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <LoyaltyProgramCreatePage />
              </RoleProtectedRoute>
            } />
            <Route path="loyalty-programs/:id/edit" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <LoyaltyProgramEditPage />
              </RoleProtectedRoute>
            } />
            <Route path="design" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <V2DesignPage />
              </RoleProtectedRoute>
            } />
            <Route path="welcome-qr" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <V2WelcomeQRPage />
              </RoleProtectedRoute>
            } />
            <Route path="demo" element={<DemoPage />} />
            <Route path="forms-demo" element={<FormsDemo />} />
            <Route path="scanner-demo" element={<ScannerDemo />} />
            <Route path="design-demo" element={<DesignDemo />} />
          </Route>

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
      <SonnerToaster />
    </I18nProvider>
  );
}

export default App; 
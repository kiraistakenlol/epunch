import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient, I18nProvider } from 'e-punch-common-ui';
import { ROLES } from 'e-punch-common-core';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchMerchant } from '../store/merchantSlice';
import { selectIsAuthenticated } from '../store/authSlice';
import { LoginPage } from '../features/auth/LoginPage';
import { MerchantOnboardingPage } from '../features/onboarding/MerchantOnboardingPage';
import { AppLayout } from '../components/shared/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { V2LoyaltyProgramsPage } from '../features/loyalty-programs/LoyaltyProgramsPage';
import { LoyaltyProgramCreatePage } from '../features/loyalty-programs/LoyaltyProgramCreatePage';
import { LoyaltyProgramEditPage } from '../features/loyalty-programs/LoyaltyProgramEditPage';
import { V2DesignPage } from '../features/design/pages/DesignPage';
import { V2ScannerPage } from '../features/scanner/pages/ScannerPage';
import { WelcomeQRPage as V2WelcomeQRPage } from '../features/scanner/pages';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { Toaster } from '../components/ui/sonner';
import '../styles/global.css';
import { RootState } from '../store/store';

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

          {/* Protected Application Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AuthenticatedRedirect />} />
            <Route path="dashboard" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardPage />
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
            <Route path="analytics" element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AnalyticsPage />
              </RoleProtectedRoute>
            } />
          </Route>

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </I18nProvider>
  );
}

export default App; 
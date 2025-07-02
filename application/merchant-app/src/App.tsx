import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { configureApiClient, I18nProvider } from 'e-punch-common-ui';
import { ROLES } from 'e-punch-common-core';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { fetchMerchant } from './store/merchantSlice';
import { selectIsAuthenticated } from './store/authSlice';
import { LoginPage } from './pages/login/LoginPage';
import { AppLayout } from './components/shared';
import { DashboardPage } from './pages/dashboard/DashboardPage.tsx';
import { LoyaltyProgramsPage } from './pages/loyalty-programs/LoyaltyProgramsPage.tsx';
import { LoyaltyProgramCreate } from './pages/loyalty-programs/LoyaltyProgramCreate';
import { LoyaltyProgramEdit } from './pages/loyalty-programs/LoyaltyProgramEdit';
import { DesignPage } from './pages/design/DesignPage.tsx';
import ScannerPage from './pages/scanner/ScannerPage';
import { WelcomeQRPage } from './pages/welcome-qr/WelcomeQRPage';
import { MerchantOnboardingPage } from './pages/merchant-onboarding/MerchantOnboardingPage';
import UserAppTestPage from './pages/test/UserAppTestPage';
import { DemoPage, FormsDemo, ScannerDemo, DesignDemo } from './components/v2/demo';
import { V2Layout } from './components/v2/layout/V2Layout';
import { V2DashboardPage } from './pages/v2/dashboard/DashboardPage';
import { V2LoyaltyProgramsPage } from './pages/v2/loyalty-programs/LoyaltyProgramsPage';
import { LoyaltyProgramCreatePage } from './pages/v2/loyalty-programs/LoyaltyProgramCreatePage';
import { LoyaltyProgramEditPage } from './pages/v2/loyalty-programs/LoyaltyProgramEditPage';
import { V2DesignPage } from './pages/v2/design/DesignPage';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { injectCSSVariables } from './styles/css-variables';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from './store/store';

// Configure API client
const API_BASE_URL = import.meta.env.VITE_API_URL;
if (API_BASE_URL) {
  configureApiClient(API_BASE_URL);
} else {
  console.error('(MerchantApp) VITE_API_URL is not set. API calls will fail.');
}

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5d4037',
      light: '#8d6e63',
      dark: '#3e2723',
      contrastText: '#f5f5dc',
    },
    secondary: {
      main: '#795548',
      light: '#a1887f',
      dark: '#4e342e',
      contrastText: '#f5f5dc',
    },
    background: {
      default: '#424242',
      paper: '#f5f5dc',
    },
    text: {
      primary: '#3e2723',
      secondary: '#5d4037',
    },
  },
  typography: {
    fontFamily: '-apple-modal, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

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

const StaffRedirect: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  
  if (user?.role === ROLES.STAFF) {
    return <Navigate to="/scanner" replace />;
  }
  
  return <Navigate to="/" replace />;
};

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Inject CSS variables from constants
  React.useEffect(() => {
    injectCSSVariables();
  }, []);

  // Fetch merchant data when authenticated
  React.useEffect(() => {
    if (user?.merchantId) {
      dispatch(fetchMerchant(user.merchantId));
    }
  }, [user?.merchantId, dispatch]);

  return (
    <I18nProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding/:merchantSlug" element={<MerchantOnboardingPage />} />
            <Route path="test/user-app" element={<UserAppTestPage />} />

            {/* V2 Routes */}
            <Route path="/v2" element={<V2Layout />}>
              <Route index element={<Navigate to="/v2/demo" replace />} />
              <Route path="dashboard" element={<V2DashboardPage />} />
              <Route path="loyalty-programs" element={<V2LoyaltyProgramsPage />} />
              <Route path="loyalty-programs/create" element={<LoyaltyProgramCreatePage />} />
              <Route path="loyalty-programs/:id/edit" element={<LoyaltyProgramEditPage />} />
              <Route path="design" element={<V2DesignPage />} />
              <Route path="demo" element={<DemoPage />} />
              <Route path="forms-demo" element={<FormsDemo />} />
              <Route path="scanner-demo" element={<ScannerDemo />} />
              <Route path="design-demo" element={<DesignDemo />} />
            </Route>

            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StaffRedirect />} />
              <Route path="scanner" element={<ScannerPage />} />
              <Route path="dashboard" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <DashboardPage />
                </RoleProtectedRoute>
              } />
              <Route path="loyalty-programs" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <LoyaltyProgramsPage />
                </RoleProtectedRoute>
              } />
              <Route path="loyalty-programs/create" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <LoyaltyProgramCreate />
                </RoleProtectedRoute>
              } />
              <Route path="loyalty-programs/:id/edit" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <LoyaltyProgramEdit />
                </RoleProtectedRoute>
              } />
              <Route path="design" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <DesignPage />
                </RoleProtectedRoute>
              } />
              <Route path="welcome-qr" element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <WelcomeQRPage />
                </RoleProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Toaster />
        <SonnerToaster />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App; 
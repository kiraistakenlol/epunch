import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { configureApiClient } from 'e-punch-common-ui';
import { useAppSelector } from './store/hooks';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Merchants } from './pages/Merchants';
import { MerchantView } from './pages/MerchantView';
import { MerchantCreate } from './pages/MerchantCreate';
import { MerchantEdit } from './pages/MerchantEdit';
import { MerchantDemoSetup } from './pages/MerchantDemoSetup';
import { Users } from './pages/Users';
import { UserView } from './pages/UserView';
import './styles/global.css';
import { AppLayout } from '../../merchant-app/src/components/shared/AppLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL;
if (API_BASE_URL) {
  configureApiClient(API_BASE_URL);
} else {
  console.error('(AdminApp) VITE_API_URL is not set. API calls will fail.');
}

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
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="merchants" element={<Merchants />} />
            <Route path="merchants/create" element={<MerchantCreate />} />
            <Route path="merchants/:id" element={<MerchantView />} />
            <Route path="merchants/:id/edit" element={<MerchantEdit />} />
            <Route path="merchant-demo-setup" element={<MerchantDemoSetup />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserView />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
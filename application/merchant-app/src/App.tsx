import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { configureApiClient } from 'e-punch-common-ui';
import { useAppSelector } from './store/hooks';
import { LoginPage } from './pages/login/LoginPage';
import { AppLayout } from './components/shared';
import { DashboardPage } from './pages/dashboard/DashboardPage.tsx';
import { LoyaltyProgramsPage } from './pages/loyalty-programs/LoyaltyProgramsPage.tsx';
import { LoyaltyProgramCreate } from './pages/loyalty-programs/LoyaltyProgramCreate';
import { LoyaltyProgramEdit } from './pages/loyalty-programs/LoyaltyProgramEdit';
import { DesignPage } from './pages/design/DesignPage.tsx';
import ScannerPage from './pages/scanner/ScannerPage';
import { injectCSSVariables } from './styles/css-variables';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

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
  const isAuthenticated = useAppSelector(state => !!state.auth.merchant);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Inject CSS variables from constants
  React.useEffect(() => {
    injectCSSVariables();
  }, []);

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
            <Route index element={<DashboardPage />} />
            <Route path="loyalty-programs" element={<LoyaltyProgramsPage />} />
            <Route path="loyalty-programs/create" element={<LoyaltyProgramCreate />} />
            <Route path="loyalty-programs/:id/edit" element={<LoyaltyProgramEdit />} />
            <Route path="design" element={<DesignPage />} />
            <Route path="scanner" element={<ScannerPage />} />
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
    </ThemeProvider>
  );
}

export default App; 
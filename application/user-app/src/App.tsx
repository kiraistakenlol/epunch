import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient, setAuthTokenProvider, I18nProvider } from 'e-punch-common-ui';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import CardPreviewPage from './pages/CardPreviewPage';
import DashboardPreviewPage from './pages/DashboardPreviewPage';
import MerchantLandingPage from './pages/MerchantLandingPage';
import DesignMockupsPage from './pages/design-mockups/DesignMockupsPage';
import AppLayout from './components/AppLayout';
import SignOutModal from './components/SignOutModal';
import GlobalAuthModal from './components/GlobalAuthModal';
import CompletionOverlay from './features/dashboard/overlay/CompletionOverlay';
import Alert from './features/alert/Alert';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { initializeUser } from './features/auth/authSlice';
import { getStoredAuthToken } from './config/amplify';
import { config } from './config/env';
import { injectCSSVariables } from './styles/css-variables';
import type { AppDispatch } from './store/store';
import './styles/global.css';
import { useGlobalAnimationEvents } from './hooks/useGlobalAnimationEvents';

configureApiClient(config.api.baseUrl);

setAuthTokenProvider(() => {
  return getStoredAuthToken();
});

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    injectCSSVariables();
    dispatch(initializeUser());
  }, [dispatch]);

  useGlobalAnimationEvents();

  return (
    <I18nProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dev" element={<DevPage />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="merchant/card-preview" element={<CardPreviewPage />} />
          <Route path="preview" element={<DashboardPreviewPage />} />
          <Route path="for-merchants" element={<MerchantLandingPage />} />
          <Route path="design-mockup" element={<DesignMockupsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SignOutModal />
        <GlobalAuthModal />
        <CompletionOverlay />
        <Alert />
      </BrowserRouter>
    </I18nProvider>
  );
}

export default App; 
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
import { initializeUser } from './features/auth/authSlice';
import { configureAmplify, setupAuthListener } from './config/amplify';
import { config } from './config/env';
import { fetchAuthSession } from 'aws-amplify/auth';
import { injectCSSVariables } from './styles/css-variables';
import type { AppDispatch } from './store/store';
import './styles/global.css';
import { useGlobalAnimationEvents } from './hooks/useGlobalAnimationEvents';

configureApiClient(config.api.baseUrl);

// Set up async auth token provider for AWS Cognito
setAuthTokenProvider(async () => {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    // User not authenticated or session expired
    return null;
  }
});

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    configureAmplify();
    injectCSSVariables();
    
    const removeAuthListener = setupAuthListener(dispatch);
    
    dispatch(initializeUser());

    return () => {
      removeAuthListener();
    };
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
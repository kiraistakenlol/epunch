import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient } from 'e-punch-common-ui';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import CardPreviewPage from './pages/CardPreviewPage';
import DashboardPreviewPage from './pages/DashboardPreviewPage';
import MerchantLandingPage from './pages/MerchantLandingPage';
import AppLayout from './components/AppLayout';
import SignOutModal from './components/SignOutModal';
import CompletionOverlay from './features/dashboard/overlay/CompletionOverlay';
import Alert from './features/alert/Alert';
import { initializeUser } from './features/auth/authSlice';
import { configureAmplify, setupAuthListener } from './config/amplify';
import { config } from './config/env';
import { injectCSSVariables } from './styles/css-variables';
import type { AppDispatch } from './store/store';
import './styles/global.css';
import { useGlobalAnimationEvents } from './hooks/useGlobalAnimationEvents';

configureApiClient(config.api.baseUrl);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dev" element={<DevPage />} />
        </Route>
        <Route path="merchant/card-preview" element={<CardPreviewPage />} />
        <Route path="preview" element={<DashboardPreviewPage />} />
        <Route path="for-merchants" element={<MerchantLandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SignOutModal />
      <CompletionOverlay />
      <Alert />
    </BrowserRouter>
  );
}

export default App; 
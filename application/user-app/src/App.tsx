import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient } from 'e-punch-common-ui';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import AppLayout from './components/AppLayout';
import SignOutModal from './components/SignOutModal';
import CompletionOverlay from './features/dashboard/overlay/CompletionOverlay';
import Alert from './features/alert/Alert';
import { initializeUser } from './features/auth/authSlice';
import { configureAmplify, setupAuthListener } from './config/amplify';
import { config } from './config/env';
import type { AppDispatch } from './store/store';
import './styles/global.css';

configureApiClient(config.api.baseUrl);

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    configureAmplify();
    
    const removeAuthListener = setupAuthListener(dispatch);
    
    dispatch(initializeUser());

    return () => {
      removeAuthListener();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dev" element={<DevPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SignOutModal />
      <CompletionOverlay />
      <Alert />
    </BrowserRouter>
  );
}

export default App; 
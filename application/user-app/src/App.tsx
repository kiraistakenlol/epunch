import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient } from 'e-punch-common-ui';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import SignOutModal from './components/SignOutModal';
import CompletionOverlay from './features/dashboard/CompletionOverlay';
import Alert from './features/alert/Alert';
import { initializeUser as initializeUser, selectUserId } from './features/auth/authSlice';
import { configureAmplify, setupAuthListener } from './config/amplify';
import { config } from './config/env';
import type { AppDispatch } from './store/store';
import './styles/global.css';
import { useWebSocketEventHandler } from './hooks/useWebSocketEventHandler';
import { useAnimationExecutor } from './features/animations/useAnimationExecutor';
import { fetchPunchCards } from './features/punchCards/punchCardsSlice';
import { useAppSelector } from './store/hooks';

configureApiClient(config.api.baseUrl);

function App() {
  const dispatch: AppDispatch = useDispatch();

  const userId = useAppSelector(selectUserId);
  
  useWebSocketEventHandler();
  useAnimationExecutor();

  useEffect(() => {
    configureAmplify();
    
    const removeAuthListener = setupAuthListener(dispatch);
    
    dispatch(initializeUser());

    return () => {
      removeAuthListener();
    };
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPunchCards(userId));
    }
  }, [userId, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dev" element={<DevPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SignOutModal />
      <CompletionOverlay />
      <Alert />
    </BrowserRouter>
  );
}

export default App; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient } from 'e-punch-common-ui';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import { initializeUser as initializeUser, selectUserId } from './features/auth/authSlice';
import { configureAmplify, setupAuthListener } from './config/amplify';
import { config } from './config/env';
import type { AppDispatch } from './store/store';
import './styles/global.css';
import { useWebSocketEventHandler } from './hooks/useWebSocketEventHandler';
import { fetchPunchCards } from './features/punchCards/punchCardsSlice';
import { useAppSelector } from './store/hooks';

configureApiClient(config.api.baseUrl);

function App() {
  const dispatch: AppDispatch = useDispatch();

  const userId = useAppSelector(selectUserId);
  
  useWebSocketEventHandler();

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
    </BrowserRouter>
  );
}

export default App; 
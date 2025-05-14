import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { configureApiClient } from 'e-punch-common';
import DashboardPage from './features/dashboard/DashboardPage';
import DevPage from './features/dev/DevPage';
import { loadOrInitializeUserId } from './features/auth/authSlice';
import type { AppDispatch } from './store/store';
import './styles/global.css';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;
console.log('API_BASE_URL from App.tsx:', API_BASE_URL);
configureApiClient(API_BASE_URL);

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrInitializeUserId());
  }, [dispatch]);

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
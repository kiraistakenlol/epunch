import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DashboardPage from './features/dashboard/DashboardPage';
import { loadOrInitializeUserId } from './features/auth/authSlice';
import type { AppDispatch } from './store/store';
import './styles/global.css';

function App() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrInitializeUserId());
  }, [dispatch]);

  return (
    <DashboardPage />
  );
}

export default App; 
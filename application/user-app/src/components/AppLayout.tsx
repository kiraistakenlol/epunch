import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { selectUserId, selectIsAuthenticated } from '../features/auth/authSlice';
import { useAppSelector } from '../store/hooks';
import { useWebSocketEventHandler } from '../hooks/useWebSocketEventHandler';
import { useAnimationExecutor } from '../features/animations/useAnimationExecutor';
import { useLoyaltyProgramsSync } from '../features/loyaltyPrograms/useLoyaltyProgramsSync';
import { useMerchantOnboarding } from '../hooks/useMerchantOnboarding';
import { clearPunchCards, fetchPunchCards } from '../features/punchCards/punchCardsSlice';
import { clearBundles, fetchBundles } from '../features/bundles/bundlesSlice';
import type { AppDispatch } from '../store/store';

const AppLayout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = useAppSelector(selectUserId);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  useWebSocketEventHandler();
  useAnimationExecutor();
  useLoyaltyProgramsSync();
  useMerchantOnboarding();

  useEffect(() => {
    if (userId) {
      dispatch(fetchPunchCards(userId));
      if (isAuthenticated) {
        console.log('isAuthenticated', isAuthenticated);
        dispatch(fetchBundles(userId));
      } else {
        dispatch(clearBundles());
      }
    } else {
      dispatch(clearPunchCards());
      dispatch(clearBundles());
    }
  }, [userId, isAuthenticated, dispatch]);

  return <Outlet />;
};

export default AppLayout; 
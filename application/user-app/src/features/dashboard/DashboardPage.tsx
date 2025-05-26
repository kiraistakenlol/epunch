import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import PunchCardsSection from './PunchCardsSection';
import AuthContainer from '../auth/AuthContainer';
import styles from './DashboardPage.module.css';
import type { RootState } from '../../store/store';
import { selectUserId, selectIsAuthenticated, selectAuthLoading } from '../auth/authSlice';
import { AppHeader, SignOutModal } from 'e-punch-common-ui';
import { signOut } from 'aws-amplify/auth';
import { useAppSelector } from '../../store/hooks';

const DashboardPage: React.FC = () => {
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const userId = useSelector((state: RootState) => selectUserId(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmSignOut = async () => {
    await signOut();
  };

  const handleCloseSignOutModal = () => {
    setIsSignOutModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader 
        title="EPunch" 
        showProfileMenu={isAuthenticated}
        onSignOut={handleSignOut}
      />
      {!isAuthLoading && <AuthContainer />}

      <main className={styles.mainContent}>
        <div className={styles.qrSection}>
          <div className={styles.qrCodeContainer}>
            {userId && <UserQRCode userId={userId} />}
          </div>
        </div>

        <div className={styles.cardsSection}>
          {!isAuthLoading && <PunchCardsSection />}
        </div>
      </main>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={handleCloseSignOutModal}
        onConfirm={handleConfirmSignOut}
      />
    </div>
  );
};

export default DashboardPage; 
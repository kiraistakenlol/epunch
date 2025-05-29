import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QRCode from '../qrCode/QRCode';
import PunchCardsSection from './PunchCardsSection';
import AuthContainer from '../auth/AuthContainer';
import AppHeader from '../../components/AppHeader';
import styles from './DashboardPage.module.css';
import type { RootState } from '../../store/store';
import { selectAuthLoading } from '../auth/authSlice';
import { selectSelectedCard, clearSelectedCard } from '../punchCards/punchCardsSlice';
import { openSignOutModal } from '../signOut/signOutSlice';
import { useAppSelector } from '../../store/hooks';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));

  const handleSignOut = () => {
    dispatch(openSignOutModal());
  };

  const handleMainContentClick = () => {
    if (selectedCard) {
      dispatch(clearSelectedCard());
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader onSignOut={handleSignOut} />
      {!isAuthLoading && <AuthContainer />}

      <main className={styles.mainContent} onClick={handleMainContentClick}>
        <div className={styles.qrSection}>
          <div className={styles.qrCodeContainer}>
            <QRCode />
          </div>
        </div>

        <div className={styles.cardsSection}>
          {!isAuthLoading && <PunchCardsSection />}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
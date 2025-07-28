import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import QRCode from '../qrCode/QRCode';
import LoyaltyCards from './loyalty-cards/LoyaltyCards';
import AuthContainer from '../auth/AuthContainer';
import AppHeader from '../../components/AppHeader';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectAuthLoading } from '../auth/authSlice';
import { selectSelectedCard, clearSelectedCard } from '../punchCards/punchCardsSlice';
import { useAppSelector } from '../../store/hooks';

const DashboardPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));

  const handleMainContentClick = () => {
    if (selectedCard) {
      dispatch(clearSelectedCard());
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerSection}>
        <AppHeader />
      </header>

      {!isAuthLoading && <AuthContainer />}
      
      <main className={styles.bodySection} onClick={handleMainContentClick}>
          <QRCode />
      </main>
      
      <section className={styles.bottomSection}>
        <LoyaltyCards />
      </section>
    </div>
  );
};

export default DashboardPage; 
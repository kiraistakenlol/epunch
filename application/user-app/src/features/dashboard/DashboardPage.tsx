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
import { useAppSelector } from '../../store/hooks';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const selectedCard = useSelector((state: RootState) => selectSelectedCard(state));

  const handleMainContentClick = () => {
    if (selectedCard) {
      dispatch(clearSelectedCard());
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader />

      {!isAuthLoading && <AuthContainer />}
      <main className={styles.mainContent} onClick={handleMainContentClick}>
        <section className={styles.qrSection}>
          <QRCode />
        </section>
        <section className={styles.cardsSection}>
          {!isAuthLoading && <PunchCardsSection />}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage; 
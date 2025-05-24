import React from 'react';
import { useSelector } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import PunchCardsSection from './PunchCardsSection';
import styles from './DashboardPage.module.css';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { AppHeader } from 'e-punch-common-ui';

const DashboardPage: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));

  return (
    <div className={styles.pageContainer}>
      <AppHeader title="EPunch" />

      <main className={styles.mainContent}>
        <div className={styles.qrSection}>
          <div className={styles.qrCodeContainer}>
            {userId && <UserQRCode userId={userId} />}
          </div>
        </div>

        <div className={styles.cardsSection}>
          <PunchCardsSection />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
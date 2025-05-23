import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { PunchCardDto } from 'e-punch-common-core';
import { AppHeader } from 'e-punch-common-ui';
import { 
  fetchPunchCards, 
  selectPunchCards, 
  selectPunchCardsLoading, 
  selectPunchCardsError,
  clearPunchCards 
} from '../punchCards/punchCardsSlice';

// Interface for component props, maps DTO to what component expects
interface PunchCardItemProps extends PunchCardDto {}

// Placeholder for icons - replace with actual SVGs or an icon library
const LocationPinIcon = () => (
  <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const PunchCardItem: React.FC<PunchCardItemProps> = ({ shopName, shopAddress, currentPunches, totalPunches, status }) => {
  const punchCircles = [];
  for (let i = 0; i < totalPunches; i++) {
    punchCircles.push(
      <div key={i} className={`${styles.punchCircle} ${i < currentPunches ? styles.punchCircleFilled : ''}`}></div>
    );
  }

  return (
    <div className={`${styles.punchCardItem} ${styles[`status${status}`]}`}>
      <div className={styles.punchCardHeader}>
        <LocationPinIcon />
        {shopAddress}
      </div>
      <div className={styles.punchCardBody}>
        <div className={styles.punchCirclesContainer}>
          {punchCircles}
        </div>
      </div>
      <div className={styles.punchCardFooter}>
        <span className={styles.shopName}>{shopName}</span>
        <span className={styles.cardStatus}>{status}</span>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));

  useEffect(() => {
    if (userId === null) {
      dispatch(clearPunchCards());
      return;
    }
    if (userId) {
      dispatch(fetchPunchCards(userId));
    } else {
      dispatch(clearPunchCards());
    }
  }, [userId, dispatch]);

  const cardsArray = Array.isArray(punchCards) ? punchCards : [];

  // Render content based on loading and data state
  const renderPunchCardContent = () => {
    if (isLoading) {
      return <p>Loading punch cards...</p>;
    } 
    if (error) {
      return <p>Error: {error}</p>;
    } 
    if (cardsArray.length === 0) {
      return <p>No punch cards yet. Start collecting!</p>;
    }
    return cardsArray.map((card, index) => (
      <PunchCardItem key={`${card.shopName}-${index}`} {...card} />
    ));
  };

  return (
    <>
      <AppHeader title="EPunch" />
      <div className={styles.pageContainer}>

        <section className={styles.qrSection}>
          <div className={styles.qrCodeWrapper}>
            <UserQRCode />
          </div>
        </section>

        <section className={styles.punchCardsSection}>
          <div className={styles.punchCardsList}>
            {renderPunchCardContent()}
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardPage; 
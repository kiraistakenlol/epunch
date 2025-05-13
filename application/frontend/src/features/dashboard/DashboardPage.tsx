import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import styles from './DashboardPage.module.css';
import type { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { apiClient, PunchCardDto } from '../../apiClient';

// Interface for component props, maps DTO to what component expects
interface PunchCardItemProps extends PunchCardDto {}

// Placeholder for icons - replace with actual SVGs or an icon library
const LocationPinIcon = () => (
  <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className={styles.starIcon} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.28 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PunchCardItem: React.FC<PunchCardItemProps> = ({ shopName, shopAddress, currentPunches, totalPunches }) => {
  const punchCircles = [];
  for (let i = 0; i < totalPunches; i++) {
    punchCircles.push(
      <div key={i} className={`${styles.punchCircle} ${i < currentPunches ? styles.punchCircleFilled : ''}`}></div>
    );
  }

  return (
    <div className={styles.punchCardItem}>
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
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  
  const [punchCards, setPunchCards] = useState<PunchCardDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId === null) {
        setIsLoading(false);
        setPunchCards([]);
        return;
    }
    if (userId) {
      const fetchCards = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedData = await apiClient.getUserPunchCards(userId);
          console.log('Fetched punch card data:', fetchedData); // Log the fetched data
          if (Array.isArray(fetchedData)) {
            setPunchCards(fetchedData);
          } else {
            console.error('Received data is not an array:', fetchedData);
            setError('Received unexpected data format for punch cards.');
            setPunchCards([]); // Ensure punchCards is an empty array
          }
        } catch (e: any) {
          console.error('Error fetching punch cards in component:', e);
          setError(e.message || 'An unexpected error occurred while fetching punch cards.');
          setPunchCards([]);
        }
        setIsLoading(false);
      };
      fetchCards();
    } else {
      setIsLoading(false);
      setPunchCards([]);
    }
  }, [userId]);

  let punchCardContent;
  // Ensure punchCards is treated as an array before accessing .length or .map
  const cardsArray = Array.isArray(punchCards) ? punchCards : [];

  if (isLoading) {
    punchCardContent = <p>Loading punch cards...</p>;
  } else if (error) {
    punchCardContent = <p>Error: {error}</p>;
  } else if (cardsArray.length === 0) {
    punchCardContent = <p>No punch cards yet. Start collecting!</p>;
  } else {
    punchCardContent = cardsArray.map((card, index) => (
      <PunchCardItem key={`${card.shopName}-${index}`} {...card} />
    ));
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>E PUNCH.IO</div>
      </header>

      <section className={styles.qrSection}>
        <div className={styles.qrCodeWrapper}>
          <UserQRCode />
        </div>
      </section>

      <section className={styles.punchCardsSection}>
        <div className={styles.punchCardsList}>
          {punchCardContent}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage; 
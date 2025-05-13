import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './DashboardPage.module.css';

// Mock Data
const userQrData = 'epunch-user-id-12345'; // Replace with actual user data later

interface PunchCardProps {
  id: string;
  shopName: string;
  shopAddress: string;
  currentPunches: number;
  totalPunches: number;
  isFavorite?: boolean;
}

const mockPunchCards: PunchCardProps[] = [
  {
    id: '1',
    shopName: 'Pottery Cafe',
    shopAddress: '123 Clay St, Artville',
    currentPunches: 2,
    totalPunches: 8,
    isFavorite: true,
  },
  {
    id: '2',
    shopName: 'Books & Beans',
    shopAddress: '456 Read Lane, Novel Town',
    currentPunches: 5,
    totalPunches: 10,
  },
  {
    id: '3',
    shopName: 'Green Grocer',
    shopAddress: '789 Produce Ave, Farmburg',
    currentPunches: 8,
    totalPunches: 8,
  },
];

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

const PunchCardItem: React.FC<PunchCardProps> = ({ shopName, shopAddress, currentPunches, totalPunches, isFavorite }) => {
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
        {isFavorite && <StarIcon />}
        <span className={styles.shopName}>{shopName}</span>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>E PUNCH.IO</div>
      </header>

      <section className={styles.qrSection}>
        <div className={styles.qrCodeWrapper}>
          <QRCodeSVG value={userQrData} size={200} bgColor="#FFFFFF" fgColor="#000000" level="Q" />
        </div>
      </section>

      <section className={styles.punchCardsSection}>
        <div className={styles.punchCardsList}>
          {mockPunchCards.map(card => (
            <PunchCardItem key={card.id} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage; 
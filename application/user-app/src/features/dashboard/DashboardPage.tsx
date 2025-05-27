import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from '../qrCode/QRCode';
import PunchCardsSection from './PunchCardsSection';
import AuthContainer from '../auth/AuthContainer';
import styles from './DashboardPage.module.css';
import type { RootState } from '../../store/store';
import { selectUserId, selectIsAuthenticated, selectAuthLoading } from '../auth/authSlice';
import { selectPunchCards } from '../punchCards/punchCardsSlice';
import { AppHeader, SignOutModal } from 'e-punch-common-ui';
import { signOut } from 'aws-amplify/auth';
import { useAppSelector } from '../../store/hooks';
import type { QRValueDto } from 'e-punch-common-core';

const DashboardPage: React.FC = () => {
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const userId = useSelector((state: RootState) => selectUserId(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleSignOut = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmSignOut = async () => {
    await signOut();
  };

  const handleCloseSignOutModal = () => {
    setIsSignOutModalOpen(false);
  };

  const handleCardClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  };

  const selectedCard = punchCards?.find(card => card.id === selectedCardId);
  const isRewardMode = selectedCard?.status === 'REWARD_READY';
  
  const generateQRValue = (): string => {
    if (isRewardMode && selectedCardId) {
      const qrData: QRValueDto = {
        type: 'redemption_punch_card_id',
        punch_card_id: selectedCardId
      };
      return JSON.stringify(qrData);
    } else if (userId) {
      const qrData: QRValueDto = {
        type: 'user_id',
        user_id: userId
      };
      return JSON.stringify(qrData);
    }
    return '';
  };

  const qrValue = generateQRValue();

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
            {qrValue && (
              <QRCode 
                value={qrValue} 
                isRewardMode={isRewardMode}
              />
            )}
          </div>
        </div>

        <div className={styles.cardsSection}>
          {!isAuthLoading && (
            <PunchCardsSection 
              selectedCardId={selectedCardId}
              onCardClick={handleCardClick}
            />
          )}
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
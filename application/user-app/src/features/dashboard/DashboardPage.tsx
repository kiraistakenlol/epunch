import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { PunchCardDto, AppEvent } from 'e-punch-common-core';
import { AppHeader } from 'e-punch-common-ui';
import { 
  fetchPunchCards, 
  selectPunchCards, 
  selectPunchCardsLoading, 
  selectPunchCardsError,
  clearPunchCards,
  addPunchCard,
  incrementPunchById
} from '../punchCards/punchCardsSlice';
import { useWebSocket } from '../../hooks/useWebSocket';

// Interface for component props, maps DTO to what component expects
interface PunchCardItemProps extends PunchCardDto {
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
}

// Placeholder for icons - replace with actual SVGs or an icon library
const LocationPinIcon = () => (
  <svg className={styles.locationIcon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const PunchCardItem: React.FC<PunchCardItemProps> = ({ shopName, shopAddress, currentPunches, totalPunches, status, createdAt, isHighlighted = false, animatedPunchIndex }) => {
  const punchCircles = [];
  for (let i = 0; i < totalPunches; i++) {
    const isFilled = i < currentPunches;
    const isAnimated = animatedPunchIndex === i;
    punchCircles.push(
      <div key={i} className={`${styles.punchCircle} ${isFilled ? styles.punchCircleFilled : ''} ${isAnimated ? styles.punchCircleAnimated : ''}`}></div>
    );
  }

  // Format date as MM/DD/YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits
    return `${month}/${day}/${year}`;
  };

  return (
    <div className={`${styles.punchCardItem} ${styles[`status${status}`]} ${isHighlighted ? styles.highlighted : ''}`}>
      <div className={styles.punchCardHeader}>
        <div className={styles.headerLeft}>
          <LocationPinIcon />
          {shopAddress}
        </div>
        <div className={styles.headerRight}>
          {formatDate(createdAt)}
        </div>
      </div>
      <div className={styles.punchCardBody}>
        <div className={styles.punchCirclesContainer}>
          {punchCircles}
        </div>
      </div>
      <div className={styles.punchCardFooter}>
        <span className={styles.shopName}>{shopName}</span>
        <span className={styles.cardStatus}>{status.replace('_', ' ')}</span>
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
  
  // WebSocket events
  const { events } = useWebSocket();
  
  // State for alerts and animations
  const [alert, setAlert] = useState<string | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [newCardAnimation, setNewCardAnimation] = useState<boolean>(false);
  const [animatedPunch, setAnimatedPunch] = useState<{ cardId: string; punchIndex: number } | null>(null);

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

  // Handle WebSocket events
  useEffect(() => {
    if (!userId || events.length === 0) return;

    const latestEvent = events[events.length - 1];
    
    // Only process punch_event type that contains our AppEvent data
    if (latestEvent.type === 'punch_event' && latestEvent.data && latestEvent.data[0]) {
      const appEvent = latestEvent.data[0] as AppEvent;
      
      // Only handle events for current user
      if (appEvent.userId !== userId) return;

      if (appEvent.type === 'PUNCH_ADDED') {
        const { punchCardId, punchCardStatus } = appEvent.data;
        
        // Increment punch count and update status
        dispatch(incrementPunchById({ id: punchCardId, status: punchCardStatus }));
        
        // Show alert
        const alertMessage = punchCardStatus === 'REWARD_READY' 
          ? "🎉 You've got a new punch and your reward is ready!"
          : "✨ You've got a new punch!";
        setAlert(alertMessage);
        
        // Highlight the card
        setHighlightedCardId(punchCardId);
        
        // Get current cards array for animation
        const currentCards = Array.isArray(punchCards) ? punchCards : [];
        const card = currentCards.find(c => c.id === punchCardId);
        if (card) {
          // Animate the new punch (after increment, so currentPunches is the new punch index)
          setAnimatedPunch({ 
            cardId: punchCardId, 
            punchIndex: card.currentPunches // This will be the new punch index after increment
          });
        }
        
        // Clear alert, highlight, and animation after 3 seconds
        setTimeout(() => {
          setAlert(null);
          setHighlightedCardId(null);
          setAnimatedPunch(null);
        }, 3000);
        
      } else if (appEvent.type === 'CARD_CREATED') {
        console.log('[DashboardPage] CARD_CREATED event received:', appEvent);
        console.log('[DashboardPage] appEvent.data:', appEvent.data);
        
        const { punchCard } = appEvent.data;
        console.log('[DashboardPage] Extracted punchCard:', punchCard);
        
        if (punchCard) {
          // Delay card creation until after punch animation finishes (1.8 seconds)
          setTimeout(() => {
            console.log('[DashboardPage] Dispatching addPunchCard with:', punchCard);
            dispatch(addPunchCard(punchCard));
            
            // Show new card animation
            setNewCardAnimation(true);
            setAlert("🆕 New punch card created!");
            
            // Clear animation and alert after 3 seconds
            setTimeout(() => {
              setNewCardAnimation(false);
              setAlert(null);
            }, 3000);
          }, 1800); // Wait for punch animation to complete
        } else {
          console.error('[DashboardPage] No punchCard found in CARD_CREATED event data');
        }
      }
    }
  }, [events, userId, dispatch]); // Removed punchCards to prevent infinite loop

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
      <PunchCardItem 
        key={`${card.shopName}-${index}`} 
        {...card} 
        isHighlighted={highlightedCardId === card.id}
        animatedPunchIndex={
          animatedPunch && animatedPunch.cardId === card.id 
            ? animatedPunch.punchIndex 
            : undefined
        }
      />
    ));
  };

  return (
    <>
      <AppHeader title="EPunch" />
      {alert && (
        <div className={styles.alert}>
          {alert}
        </div>
      )}
      <div className={`${styles.pageContainer} ${newCardAnimation ? styles.newCardAnimation : ''}`}>

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
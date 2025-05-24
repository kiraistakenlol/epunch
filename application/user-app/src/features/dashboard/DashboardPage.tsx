import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserQRCode from '../user/UserQRCode';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { PunchCardDto, AppEvent } from 'e-punch-common-core';
import { AppHeader, useViewportHeight } from 'e-punch-common-ui';
import { 
  fetchPunchCards, 
  selectPunchCards, 
  selectPunchCardsLoading, 
  selectPunchCardsError,
  clearPunchCards,
  addPunchCard,
  updatePunchCard
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

const PunchCardItem: React.FC<PunchCardItemProps> = ({ 
  shopName, 
  shopAddress, 
  currentPunches, 
  totalPunches, 
  status, 
  createdAt, 
  isHighlighted = false, 
  animatedPunchIndex
}) => {
  const punchCircles = [];
  for (let i = 0; i < totalPunches; i++) {
    const isFilled = i < currentPunches;
    const isAnimated = animatedPunchIndex === i;
    punchCircles.push(
      <div 
        key={i} 
        className={`${styles.punchCircle} ${isFilled ? styles.punchCircleFilled : ''} ${isAnimated ? styles.punchCircleAnimated : ''}`}
      ></div>
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

// Props for the PunchCardsSection component
interface PunchCardsSectionProps {
  userId: string | null;
  highlightedCardId: string | null;
  animatedPunch: { cardId: string; punchIndex: number } | null;
}

const PunchCardsSection: React.FC<PunchCardsSectionProps> = ({
  userId,
  highlightedCardId,
  animatedPunch
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  const [showEmptyState, setShowEmptyState] = useState(false);

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

  useEffect(() => {
    if (isLoading || punchCards === undefined) {
      setShowEmptyState(false);
    } else if (!error && punchCards.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowEmptyState(false);
    }
  }, [isLoading, error, punchCards]);

  const renderPunchCardContent = () => {
    if (isLoading || punchCards === undefined) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingDots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      );
    } 
    if (error) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateContent}>
            <h2 className={styles.emptyStateHeadline}>Oops!</h2>
            <p className={styles.emptyStateSubtext}>Error: {error}</p>
          </div>
        </div>
      );
    } 
    if (showEmptyState) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateContent}>
            <h2 className={styles.emptyStateHeadline}>Your rewards await!</h2>
            <p className={styles.emptyStateSubtext}>Start collecting punches at your favorite spots and unlock amazing rewards</p>
          </div>
        </div>
      );
    }
    return punchCards.map((card, index) => (
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

  if (isLoading || punchCards === undefined || error || showEmptyState) {
    return (
      <section className={`${styles.punchCardsSection} ${styles.noScroll}`}>
        {renderPunchCardContent()}
      </section>
    );
  }

  return (
    <section className={styles.punchCardsSection}>
      <div className={styles.punchCardsList}>
        {renderPunchCardContent()}
      </div>
    </section>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  
  // WebSocket events
  const { events } = useWebSocket();
  
  // Initialize viewport height handling for mobile Safari
  useViewportHeight();
  
  // State for alerts and animations
  const [alert, setAlert] = useState<string | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [newCardAnimation, setNewCardAnimation] = useState<boolean>(false);
  const [animatedPunch, setAnimatedPunch] = useState<{ cardId: string; punchIndex: number } | null>(null);

  // Handle WebSocket events
  useEffect(() => {
    if (!userId || events.length === 0) return;

    const latestEvent = events[events.length - 1];
    
    if (latestEvent.type === 'punch_event' && latestEvent.data && latestEvent.data[0]) {
      const appEvent = latestEvent.data[0] as AppEvent;
      
      if (appEvent.userId !== userId) return;

      if (appEvent.type === 'PUNCH_ADDED') {
        const { punchCard } = appEvent;
        
        dispatch(updatePunchCard(punchCard));
        
        const alertMessage = punchCard.status === 'REWARD_READY' 
          ? "🎉 You've got a new punch and your reward is ready!"
          : "✨ You've got a new punch!";
        setAlert(alertMessage);
        
        setHighlightedCardId(punchCard.id);
        
        setAnimatedPunch({ 
          cardId: punchCard.id, 
          punchIndex: punchCard.currentPunches - 1
        });
        
        setTimeout(() => {
          setAlert(null);
          setHighlightedCardId(null);
          setAnimatedPunch(null);
        }, 3000);
        
      } else if (appEvent.type === 'CARD_CREATED') {
        const { punchCard } = appEvent;
        
        if (punchCard) {
          setTimeout(() => {
            dispatch(addPunchCard(punchCard));
            
            setNewCardAnimation(true);
            setAlert("🆕 New punch card created!");
            
            setTimeout(() => {
              setNewCardAnimation(false);
              setAlert(null);
            }, 3000);
          }, 1800);
        }
      }
    }
  }, [events, userId, dispatch]);

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
            {userId && <UserQRCode userId={userId} />}
          </div>
        </section>

        <PunchCardsSection 
          userId={userId}
          highlightedCardId={highlightedCardId}
          animatedPunch={animatedPunch}
        />
      </div>
    </>
  );
};

export default DashboardPage; 
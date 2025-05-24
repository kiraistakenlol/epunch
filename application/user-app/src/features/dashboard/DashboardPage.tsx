import React, { useEffect, useState, useRef } from 'react';
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
  clearPunchCards,
  clearAnimationFlag
} from '../punchCards/punchCardsSlice';
import { useWebSocketEventHandler } from '../../hooks/useWebSocketEventHandler';

// Interface for component props, maps DTO to what component expects
interface PunchCardItemProps extends PunchCardDto {
  isHighlighted?: boolean;
  animatedPunchIndex?: number;
  shouldSlideIn?: boolean;
  shouldSlideRight?: boolean;
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
  animatedPunchIndex,
  shouldSlideIn = false,
  shouldSlideRight = false
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
    <div className={`${styles.punchCardItem} ${styles[`status${status}`]} ${isHighlighted ? styles.highlighted : ''} ${shouldSlideIn ? styles.punchCardSlideIn : ''} ${shouldSlideRight ? styles.punchCardSlideRight : ''}`}>
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
  const [localHighlightedCardId, setLocalHighlightedCardId] = useState<string | null>(null);
  const [localAnimatedPunch, setLocalAnimatedPunch] = useState<{ cardId: string; punchIndex: number } | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const prevPunchCardsRef = useRef<PunchCardDto[] | undefined>(undefined);

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

  useEffect(() => {
    if (!punchCards) return;

    punchCards.forEach(card => {
      if (card.animateNewPunch) {
        const alertMessage = card.status === 'REWARD_READY'
          ? "🎉 You've got a new punch and your reward is ready!"
          : "✨ You've got a new punch!";
        setAlert(alertMessage);
        setLocalHighlightedCardId(card.id);
        setLocalAnimatedPunch({
          cardId: card.id,
          punchIndex: card.currentPunches - 1
        });

        setTimeout(() => {
          setAlert(null);
          setLocalHighlightedCardId(null);
          setLocalAnimatedPunch(null);
          dispatch(clearAnimationFlag({ cardId: card.id, flag: 'animateNewPunch' }));
        }, 3000);
      }

      if (card.animateNewCard) {
        setTimeout(() => {
          dispatch(clearAnimationFlag({ cardId: card.id, flag: 'animateNewCard' }));
        }, 600);
      }
    });
  }, [punchCards, dispatch]);

  const getCardAnimations = () => {
    if (!punchCards) return { slideInCards: new Set(), slideRightCards: new Set() };
    
    const slideInCards = new Set<string>();
    const slideRightCards = new Set<string>();
    
    punchCards.forEach((card, index) => {
      if (card.animateNewCard) {
        slideInCards.add(card.id);
        
        punchCards.forEach((otherCard, otherIndex) => {
          if (otherIndex > index && !otherCard.animateNewCard) {
            slideRightCards.add(otherCard.id);
          }
        });
      }
    });
    
    return { slideInCards, slideRightCards };
  };

  const { slideInCards, slideRightCards } = getCardAnimations();

  const renderContent = () => {
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
    return (
      <div className={styles.punchCardsList}>
        {punchCards.map((card) => (
          <PunchCardItem
            key={card.id}
            {...card}
            isHighlighted={localHighlightedCardId === card.id}
            animatedPunchIndex={
              localAnimatedPunch && localAnimatedPunch.cardId === card.id
                ? localAnimatedPunch.punchIndex
                : undefined
            }
            shouldSlideIn={slideInCards.has(card.id)}
            shouldSlideRight={slideRightCards.has(card.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {alert && (
        <div className={styles.alert}>
          {alert}
        </div>
      )}
      {renderContent()}
    </>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  
  useWebSocketEventHandler();

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

  useEffect(() => {
    if (isLoading || punchCards === undefined) {
      // Handle loading or empty state
    } else if (!error && punchCards.length === 0) {
      // Handle empty state
    }
  }, [isLoading, error, punchCards]);

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
          <PunchCardsSection
            userId={userId}
            highlightedCardId={null}
            animatedPunch={null}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
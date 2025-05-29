import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PunchCardItem from './PunchCardItem';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId, selectAuthLoading } from '../auth/authSlice';
import {
  fetchPunchCards,
  selectPunchCards,
  selectPunchCardsLoading,
  selectPunchCardsError,
  clearPunchCards,
  selectSelectedCardId,
  setSelectedCardId,
  clearSelectedCard
} from '../punchCards/punchCardsSlice';
import { useAppSelector } from '../../store/hooks';

interface PunchCardsProps {}

const PunchCards: React.FC<PunchCardsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const selectedCardId = useSelector((state: RootState) => selectSelectedCardId(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  
  const [showEmptyState, setShowEmptyState] = useState(false);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

  useEffect(() => {
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

  const getCardAnimations = () => {
    const slideInCards = new Set<string>();
    const slideRightCards = new Set<string>();
    
    if (!punchCards) return { slideInCards, slideRightCards };
    
    const newlyCreatedCards = punchCards.filter(card => card.animationFlags?.slideAnimation);
    const allCards = punchCards;
    
    newlyCreatedCards.forEach((newlyCreatedCard) => {
      slideInCards.add(newlyCreatedCard.id);
      
      const newlyCreatedCardIndex = allCards.findIndex(card => card.id === newlyCreatedCard.id);
      
      allCards.forEach((card) => {
        const cardIndex = allCards.findIndex(c => c.id === card.id);
        if (cardIndex > newlyCreatedCardIndex && !card.animationFlags?.slideAnimation) {
          slideRightCards.add(card.id);
        }
      });
    });
    
    return { slideInCards, slideRightCards };
  };

  const { slideInCards, slideRightCards } = getCardAnimations();
  
  // Filter cards based on visibility
  const cardsToRender = punchCards?.filter(card => 
    card.visible !== false && 
    card.status !== 'REWARD_REDEEMED'
  ) || [];

  const handleCardClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      dispatch(clearSelectedCard());
    } else {
      dispatch(setSelectedCardId(cardId));
    }
  };

  const renderContent = () => {
    if (isAuthLoading || isLoading || punchCards === undefined) {
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
        {cardsToRender.map((card) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[card.id] = el;
            }}
          >
            <PunchCardItem
              {...card}
              isHighlighted={card.animationFlags?.highlighted || false}
              animatedPunchIndex={card.animationFlags?.punchAnimation?.punchIndex}
              shouldSlideIn={slideInCards.has(card.id)}
              shouldSlideRight={slideRightCards.has(card.id)}
              isSelected={selectedCardId === card.id}
              onCardClick={handleCardClick}
              animateRewardClaimed={card.animationFlags?.rewardClaimedAnimation || false}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
};

export default PunchCards; 
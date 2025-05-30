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
  clearSelectedCard,
  selectScrollTargetCardId,
  clearScrollTarget,
  scrollToCard
} from '../punchCards/punchCardsSlice';
import { useAppSelector } from '../../store/hooks';
import { useLoyaltyProgramsSync } from '../loyaltyPrograms/useLoyaltyProgramsSync';

interface PunchCardsProps {}

const PunchCards: React.FC<PunchCardsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const selectedCardId = useSelector((state: RootState) => selectSelectedCardId(state));
  const scrollTargetCardId = useSelector((state: RootState) => selectScrollTargetCardId(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  
  const [showEmptyState, setShowEmptyState] = useState(false);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

  useLoyaltyProgramsSync();

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

  // Handle scrolling to target card
  useEffect(() => {
    if (scrollTargetCardId && cardRefs.current[scrollTargetCardId]) {
      const cardElement = cardRefs.current[scrollTargetCardId];
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
      // Clear the scroll target after scrolling
      dispatch(clearScrollTarget());
    }
  }, [scrollTargetCardId, dispatch]);

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
    // Handle selection logic for reward-ready cards first
    const clickedCard = cardsToRender.find(card => card.id === cardId);
    if (clickedCard?.status === 'REWARD_READY') {
      if (selectedCardId === cardId) {
        // If clicking the currently selected card, deselect it
        dispatch(clearSelectedCard());
      } else {
        // If clicking a different card (or no card selected), select the new one
        dispatch(setSelectedCardId(cardId));
      }
    } else {
      // If clicking a non-REWARD_READY card, clear any existing selection
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
    }
    
    // Then scroll to the clicked card to ensure it's fully visible
    dispatch(scrollToCard(cardId));
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
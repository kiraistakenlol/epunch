import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PunchCardItem from './punch-card/PunchCardItem';
import styles from './PunchCards.module.css';
import type { RootState, AppDispatch } from '../../../store/store';
import { selectAuthLoading } from '../../auth/authSlice';
import {
  selectPunchCards,
  selectPunchCardsLoading,
  selectPunchCardsError,
  selectSelectedCardId,
  setSelectedCardId,
  clearSelectedCard,
  selectScrollTargetCardId,
  clearScrollTarget,
  scrollToCard
} from '../../punchCards/punchCardsSlice';
import { useAppSelector } from '../../../store/hooks';

interface PunchCardsProps {}

const PunchCards: React.FC<PunchCardsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const selectedCardId = useSelector((state: RootState) => selectSelectedCardId(state));
  const scrollTargetCardId = useSelector((state: RootState) => selectScrollTargetCardId(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  
  const [showEmptyState, setShowEmptyState] = useState(false);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

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
    const clickedCard = cardsToRender.find(card => card.id === cardId);
    
    // If clicking a selected card, unselect it
    if (selectedCardId === cardId) {
      dispatch(clearSelectedCard());
    } else if (clickedCard?.status === 'REWARD_READY') {
      // For REWARD_READY cards, don't auto-select - selection only happens via "TAP TO REDEEM"
      // Just clear any existing selection if clicking a different REWARD_READY card
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
    } else {
      // If clicking a non-REWARD_READY card, always clear any existing selection
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
    }
    
    // Then scroll to the clicked card to ensure it's fully visible
    dispatch(scrollToCard(cardId));
  };

  const handleRedemptionClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      // If clicking the currently selected card's redemption button, deselect it
      dispatch(clearSelectedCard());
    } else {
      // If clicking a different card's redemption button, clear previous selection and select new one
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
      dispatch(setSelectedCardId(cardId));
    }
    
    // Also scroll to the card
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
              onRedemptionClick={handleRedemptionClick}
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
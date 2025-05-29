import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PunchCardItem from './PunchCardItem';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import {
  fetchPunchCards,
  selectPunchCards,
  selectPunchCardsLoading,
  selectPunchCardsError,
  clearPunchCards,
  updatePunchCardById
} from '../punchCards/punchCardsSlice';

const NEW_CARD_ANIMATION_DELAY = 1500;

interface PunchCardsSectionProps {
  selectedCardId?: string | null;
  onCardClick?: (cardId: string) => void;
}

const PunchCardsSection: React.FC<PunchCardsSectionProps> = ({ 
  selectedCardId, 
  onCardClick 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [localHighlightedCardId, setLocalHighlightedCardId] = useState<string | null>(null);
  const [localAnimatedPunch, setLocalAnimatedPunch] = useState<{ cardId: string; punchIndex: number } | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

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

  const getCardAnimations = () => {
    const slideInCards = new Set<string>();
    const slideRightCards = new Set<string>();
    
    if (!punchCards) return { slideInCards, slideRightCards };
    
    const hasActivePunchAnimation = punchCards.some(card => card.animateNewPunch);
    
    if (!hasActivePunchAnimation) {
      const waitingCards = punchCards.filter(card => card.animateNewCard);
      const allCards = punchCards;
      
      waitingCards.forEach((waitingCard) => {
        slideInCards.add(waitingCard.id);
        
        const waitingCardIndex = allCards.findIndex(card => card.id === waitingCard.id);
        
        allCards.forEach((card) => {
          const cardIndex = allCards.findIndex(c => c.id === card.id);
          if (cardIndex > waitingCardIndex && !card.animateNewCard) {
            slideRightCards.add(card.id);
          }
        });
      });
    }
    
    return { slideInCards, slideRightCards };
  };

  const { slideInCards, slideRightCards } = getCardAnimations();
  const hasActivePunchAnimation = punchCards ? punchCards.some(card => card.animateNewPunch) : false;
  const waitingCards = punchCards ? punchCards.filter(card => card.animateNewCard) : [];
  const rewardClaimedCards = punchCards ? punchCards.filter(card => card.animateRewardClaimed) : [];
  const visibleCards = punchCards ? punchCards.filter(card => 
    !card.animateNewCard && 
    !card.animateRewardClaimed && 
    card.status !== 'REWARD_REDEEMED'
  ) : [];
  const cardsToRender = hasActivePunchAnimation 
    ? visibleCards 
    : punchCards?.filter(card => 
        card.status !== 'REWARD_REDEEMED' || card.animateRewardClaimed
      ) || [];

  useEffect(() => {
    if (!punchCards) return;

    const hasWaitingCards = waitingCards.length > 0;

    punchCards.forEach(card => {
      if (card.animateNewPunch && !localAnimatedPunch) {
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
          dispatch(updatePunchCardById({ id: card.id, updates: { animateNewPunch: false } }));
          
          if (hasWaitingCards) {
            setTimeout(() => {
              waitingCards.forEach(waitingCard => {
                setTimeout(() => {
                  dispatch(updatePunchCardById({ id: waitingCard.id, updates: { animateNewCard: false } }));
                }, NEW_CARD_ANIMATION_DELAY);
              });
            }, NEW_CARD_ANIMATION_DELAY);
          }
        }, 3000);
      }
    });
  }, [punchCards, waitingCards, dispatch, localAnimatedPunch]);

  useEffect(() => {
    if (localAnimatedPunch && cardRefs.current[localAnimatedPunch.cardId]) {
      const cardElement = cardRefs.current[localAnimatedPunch.cardId];
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [localAnimatedPunch]);

  // Handle reward claimed animation
  useEffect(() => {
    if (!punchCards) return;

    rewardClaimedCards.forEach(card => {
      setAlert("🎉 Reward redeemed! Enjoy your treat!");
      
      setTimeout(() => {
        setAlert(null);
        dispatch(updatePunchCardById({ 
          id: card.id, 
          updates: { animateRewardClaimed: false } 
        }));
      }, 1200);
    });
  }, [rewardClaimedCards, dispatch]);

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
        {cardsToRender.map((card) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[card.id] = el;
            }}
          >
            <PunchCardItem
              {...card}
              isHighlighted={localHighlightedCardId === card.id}
              animatedPunchIndex={
                localAnimatedPunch && localAnimatedPunch.cardId === card.id
                  ? localAnimatedPunch.punchIndex
                  : undefined
              }
              shouldSlideIn={slideInCards.has(card.id)}
              shouldSlideRight={slideRightCards.has(card.id)}
              isSelected={selectedCardId === card.id}
              onCardClick={onCardClick}
              animateRewardClaimed={card.animateRewardClaimed}
            />
          </div>
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

export default PunchCardsSection; 
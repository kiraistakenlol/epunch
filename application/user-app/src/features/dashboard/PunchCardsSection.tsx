import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PunchCardItem from './PunchCardItem';
import CompletionOverlay from './CompletionOverlay';
import styles from './DashboardPage.module.css';
import type { RootState, AppDispatch } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import {
  fetchPunchCards,
  selectPunchCards,
  selectPunchCardsLoading,
  selectPunchCardsError,
  clearPunchCards,
  updatePunchCardById,
  selectSelectedCardId,
  setSelectedCardId,
  clearSelectedCard
} from '../punchCards/punchCardsSlice';
import { apiClient } from 'e-punch-common-ui';
import { LoyaltyProgramDto } from 'e-punch-common-core';

const NEW_CARD_ANIMATION_DELAY = 1500;

interface PunchCardsSectionProps {}

const PunchCardsSection: React.FC<PunchCardsSectionProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => selectUserId(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const selectedCardId = useSelector((state: RootState) => selectSelectedCardId(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [localHighlightedCardId, setLocalHighlightedCardId] = useState<string | null>(null);
  const [localAnimatedPunch, setLocalAnimatedPunch] = useState<{ cardId: string; punchIndex: number } | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [completionCard, setCompletionCard] = useState<any>(null);
  const [completionLoyaltyProgram, setCompletionLoyaltyProgram] = useState<LoyaltyProgramDto | null>(null);
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
    
    // Don't allow card animations while completion overlay is active
    if (showCompletionOverlay) return { slideInCards, slideRightCards };
    
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

    punchCards.forEach(card => {
      if (card.animateNewPunch && !localAnimatedPunch) {
        const isCardCompleted = card.status === 'REWARD_READY';
        const alertMessage = isCardCompleted
          ? "✨ You've got a new punch!"
          : "✨ You've got a new punch!";
        setAlert(alertMessage);
        setLocalAnimatedPunch({
          cardId: card.id,
          punchIndex: card.currentPunches - 1
        });

        // Step 1: Show punch animation for 3 seconds
        setTimeout(() => {
          setAlert(null);
          setLocalAnimatedPunch(null);
          dispatch(updatePunchCardById({ id: card.id, updates: { animateNewPunch: false } }));
          
          // Step 2: If card is completed, show completion overlay
          if (isCardCompleted) {
            console.log('Card is completed, showing overlay for:', card.shopName);
            // Clear any existing highlight state before showing overlay
            setLocalHighlightedCardId(null);
            
            // Small delay to ensure all animation states are cleared
            setTimeout(() => {
              const fetchLoyaltyProgramAndShowOverlay = async () => {
                try {
                  const loyaltyProgram = await apiClient.getLoyaltyProgram(card.loyaltyProgramId);
                  setCompletionCard(card);
                  setCompletionLoyaltyProgram(loyaltyProgram);
                  setShowCompletionOverlay(true);
                } catch (error) {
                  console.error('Failed to fetch loyalty program for completion overlay:', error);
                  // If we can't fetch loyalty program, still show overlay without it
                  setCompletionCard(card);
                  setCompletionLoyaltyProgram(null);
                  setShowCompletionOverlay(true);
                }
              };
              fetchLoyaltyProgramAndShowOverlay();
            }, 100); // Small delay to prevent parallel animations
          } else {
            console.log('Card not completed, proceeding with normal flow');
            // For non-completed cards, proceed with normal flow
            const currentWaitingCards = punchCards ? punchCards.filter(c => c.animateNewCard) : [];
            if (currentWaitingCards.length > 0) {
              setTimeout(() => {
                currentWaitingCards.forEach(waitingCard => {
                  setTimeout(() => {
                    dispatch(updatePunchCardById({ id: waitingCard.id, updates: { animateNewCard: false } }));
                  }, NEW_CARD_ANIMATION_DELAY);
                });
              }, NEW_CARD_ANIMATION_DELAY);
            }
          }
        }, 3000);
      }
    });
  }, [punchCards, dispatch, localAnimatedPunch]);

  // Handle completion overlay close
  const handleCompletionOverlayClose = () => {
    setShowCompletionOverlay(false);
    
    // Step 3: Start highlight animation after overlay closes
    if (completionCard) {
      setLocalHighlightedCardId(completionCard.id);
      
      setTimeout(() => {
        setLocalHighlightedCardId(null);
        
        // Step 4: Show new cards after highlight animation
        const currentWaitingCards = punchCards ? punchCards.filter(c => c.animateNewCard) : [];
        if (currentWaitingCards.length > 0) {
          setTimeout(() => {
            currentWaitingCards.forEach(waitingCard => {
              setTimeout(() => {
                dispatch(updatePunchCardById({ id: waitingCard.id, updates: { animateNewCard: false } }));
              }, NEW_CARD_ANIMATION_DELAY);
            });
          }, NEW_CARD_ANIMATION_DELAY);
        }
      }, 1500); // Duration of highlight animation
    }
    
    setCompletionCard(null);
    setCompletionLoyaltyProgram(null);
  };

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
    if (punchCards) {
      const cardWithRewardClaimed = punchCards.find(card => card.animateRewardClaimed);
      if (cardWithRewardClaimed) {
        dispatch(clearSelectedCard());
        setAlert("🎉 Reward redeemed! Enjoy your treat!");
        
        setTimeout(() => {
          setAlert(null);
          dispatch(updatePunchCardById({
            id: cardWithRewardClaimed.id,
            updates: { animateRewardClaimed: false }
          }));
        }, 1200);
      }
    }
  }, [punchCards, dispatch]);

  const handleCardClick = (cardId: string) => {
    if (selectedCardId === cardId) {
      dispatch(clearSelectedCard());
    } else {
      dispatch(setSelectedCardId(cardId));
    }
  };

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
              isHighlighted={!showCompletionOverlay && localHighlightedCardId === card.id}
              animatedPunchIndex={
                localAnimatedPunch && localAnimatedPunch.cardId === card.id
                  ? localAnimatedPunch.punchIndex
                  : undefined
              }
              shouldSlideIn={slideInCards.has(card.id)}
              shouldSlideRight={slideRightCards.has(card.id)}
              isSelected={selectedCardId === card.id}
              onCardClick={handleCardClick}
              animateRewardClaimed={card.animateRewardClaimed}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <CompletionOverlay
        isVisible={showCompletionOverlay}
        completedCard={completionCard}
        loyaltyProgram={completionLoyaltyProgram}
        onClose={handleCompletionOverlayClose}
      />
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
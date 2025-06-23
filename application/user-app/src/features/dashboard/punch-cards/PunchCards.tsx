import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import PunchCardItem from './punch-card/PunchCardItem';
import { resolveCardStyles } from '../../../utils/cardStyles';
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


const PunchCards = () => {
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
        <AnimatePresence>
          {cardsToRender.map((card) => {
            const resolvedStyles = resolveCardStyles(card.styles);

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ x: -100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, layout: { duration: 0.6 } }}
                style={{ height: '100%' }}
              >
                <PunchCardItem
                  ref={(el) => {
                    cardRefs.current[card.id] = el;
                  }}
                  {...card}
                  resolvedStyles={resolvedStyles}
                  isHighlighted={card.animationFlags?.highlighted || false}
                  animatedPunchIndex={card.animationFlags?.punchAnimation?.punchIndex}
                  isSelected={selectedCardId === card.id}
                  onCardClick={handleCardClick}
                  onRedemptionClick={handleRedemptionClick}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
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
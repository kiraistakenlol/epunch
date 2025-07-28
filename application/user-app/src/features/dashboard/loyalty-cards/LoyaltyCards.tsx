import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from 'e-punch-common-ui';
import PunchCardItem from './punch-card/PunchCardItem';
import styles from './LoyaltyCards.module.css';
import type { RootState, AppDispatch } from '../../../store/store';
import { selectAuthLoading } from '../../auth/authSlice';
import {
  selectPunchCards,
  selectPunchCardsLoading,
  selectPunchCardsError,
  selectScrollTargetCardId,
  clearScrollTarget
} from '../../punchCards/punchCardsSlice';
import { useAppSelector } from '../../../store/hooks';


const LoyaltyCards = () => {
  const { t } = useI18n('punchCards');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthLoading = useAppSelector(selectAuthLoading);
  const loyaltyCards = useSelector((state: RootState) => selectPunchCards(state));
  const scrollTargetCardId = useSelector((state: RootState) => selectScrollTargetCardId(state));
  const isLoading = useSelector((state: RootState) => selectPunchCardsLoading(state));
  const error = useSelector((state: RootState) => selectPunchCardsError(state));
  const [showEmptyState, setShowEmptyState] = useState(false);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (isLoading || loyaltyCards === undefined) {
      setShowEmptyState(false);
    } else if (!error && loyaltyCards.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowEmptyState(false);
    }
  }, [isLoading, error, loyaltyCards]);

  useEffect(() => {
    if (scrollTargetCardId && cardRefs.current[scrollTargetCardId]) {
      const cardElement = cardRefs.current[scrollTargetCardId];
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const isPartiallyVisible = rect.left < window.innerWidth && rect.right > 0;

        if (!isPartiallyVisible) {
          cardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
      dispatch(clearScrollTarget());
    }
  }, [scrollTargetCardId, dispatch]);

  const cardsToRender = loyaltyCards?.filter(card =>
    card.status !== 'REWARD_REDEEMED'
  ) || [];


  const renderContent = () => {
    if (isAuthLoading || isLoading || loyaltyCards === undefined) {
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
            <h2 className={styles.emptyStateHeadline}>{t('error.title')}</h2>
            <p className={styles.emptyStateSubtext}>{t('error.message', { error })}</p>
          </div>
        </div>
      );
    }
    if (showEmptyState) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateContent}>
            <h2 className={styles.emptyStateHeadline}>{t('empty.title')}</h2>
            <p className={styles.emptyStateSubtext}>{t('empty.message')}</p>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.loyaltyCardsList}>
        <AnimatePresence>
          {cardsToRender.map((card) => {
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

export default LoyaltyCards; 
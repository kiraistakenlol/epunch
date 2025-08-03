import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from 'e-punch-common-ui';
import PunchCardItem from './punch-card/PunchCardItem';
import BundleCardItem from './bundle-card/BundleCardItem';
import BenefitCardItem from './benefit-card/BenefitCardItem';
import type { PunchCardDto, BundleDto, BenefitCardDto } from 'e-punch-common-core';
import styles from './LoyaltyCards.module.css';
import type { RootState, AppDispatch } from '../../../store/store';
import { selectIsAuthenticated } from '../../auth/authSlice';
import {
  selectPunchCards,
  selectPunchCardsInitialized,
  selectScrollTargetCardId,
  clearScrollTarget
} from '../../punchCards/punchCardsSlice';
import {
  selectBundles,
  selectBundlesInitialized,
  selectScrollTargetBundleId,
  clearScrollTarget as clearBundleScrollTarget
} from '../../bundles/bundlesSlice';
import {
  selectBenefitCards,
  selectBenefitCardsInitialized,
  selectScrollTargetBenefitCardId,
  clearScrollTarget as clearBenefitCardScrollTarget
} from '../../benefitCards/benefitCardsSlice';


const LoyaltyCards = () => {
  const { t } = useI18n('punchCards');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const bundles = useSelector((state: RootState) => selectBundles(state));
  const benefitCards = useSelector((state: RootState) => selectBenefitCards(state));
  const scrollTargetCardId = useSelector((state: RootState) => selectScrollTargetCardId(state));
  const scrollTargetBundleId = useSelector((state: RootState) => selectScrollTargetBundleId(state));
  const scrollTargetBenefitCardId = useSelector((state: RootState) => selectScrollTargetBenefitCardId(state));
  const isPunchCardsInitialized = useSelector((state: RootState) => selectPunchCardsInitialized(state));
  const isBundlesInitialized = useSelector((state: RootState) => selectBundlesInitialized(state));
  const isBenefitCardsInitialized = useSelector((state: RootState) => selectBenefitCardsInitialized(state));
  
  // Combined state
  const isLoading = !isPunchCardsInitialized || (isAuthenticated && !isBundlesInitialized) || (isAuthenticated && !isBenefitCardsInitialized);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const cardRefs = useRef<{ [cardId: string]: HTMLDivElement | null }>({});

  // Merge and sort all loyalty items
  const allLoyaltyCards = useMemo(() => {
    const combined = [
      ...(punchCards?.map((card: PunchCardDto) => ({ type: 'punch_card' as const, ...card })) || []),
      ...(bundles?.map((bundle: BundleDto) => ({ type: 'bundle' as const, ...bundle })) || []),
      ...(benefitCards?.map((benefitCard: BenefitCardDto) => ({ type: 'benefit_card' as const, ...benefitCard })) || [])
    ];
    return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [punchCards, bundles, benefitCards]);

  useEffect(() => {
    if (isLoading) {
      setShowEmptyState(false);
    } else if (allLoyaltyCards.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowEmptyState(false);
    }
  }, [isLoading, allLoyaltyCards]);

  useEffect(() => {
    const targetId = scrollTargetCardId || scrollTargetBundleId || scrollTargetBenefitCardId;
    if (targetId && cardRefs.current[targetId]) {
      const cardElement = cardRefs.current[targetId];
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
      if (scrollTargetCardId) dispatch(clearScrollTarget());
      if (scrollTargetBundleId) dispatch(clearBundleScrollTarget());
      if (scrollTargetBenefitCardId) dispatch(clearBenefitCardScrollTarget());
    }
  }, [scrollTargetCardId, scrollTargetBundleId, scrollTargetBenefitCardId, dispatch]);

  const cardsToRender = allLoyaltyCards.filter(item => {
    if (item.type === 'punch_card') {
      return item.status !== 'REWARD_REDEEMED';
    }
    // For bundles, show all (expired/used up will be visually differentiated)
    return true;
  });

  const renderContent = () => {
    if (isLoading) {
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
          {cardsToRender.map((item) => {
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ x: -100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, layout: { duration: 0.6 } }}
                style={{ height: '100%' }}
              >
                {item.type === 'punch_card' ? (
                  <PunchCardItem
                    ref={(el) => {
                      cardRefs.current[item.id] = el;
                    }}
                    {...item}
                  />
                ) : item.type === 'bundle' ? (
                  <BundleCardItem
                    ref={(el) => {
                      cardRefs.current[item.id] = el;
                    }}
                    {...item}
                  />
                ) : (
                  <BenefitCardItem
                    ref={(el) => {
                      cardRefs.current[item.id] = el;
                    }}
                    {...item}
                  />
                )}
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
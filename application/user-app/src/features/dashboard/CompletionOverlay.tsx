import React, { useState, useEffect } from 'react';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import styles from './CompletionOverlay.module.css';
import { handleEvent } from '../animations/animationSlice';
import { hideOverlay, selectCompletionOverlay } from './completionOverlaySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectPunchCards } from '../punchCards/punchCardsSlice';
import { apiClient } from 'e-punch-common-ui';

const CompletionOverlay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const completionOverlay = useSelector((state: RootState) => selectCompletionOverlay(state));
  const punchCards = useSelector((state: RootState) => selectPunchCards(state));
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgramDto | null>(null);

  // Find the completed card from punch cards slice
  const completedCard = punchCards?.find(card => card.id === completionOverlay.cardId) || null;

  // Fetch loyalty program data when card changes
  useEffect(() => {
    if (completedCard?.loyaltyProgramId) {
      const fetchLoyaltyProgram = async () => {
        try {
          const program = await apiClient.getLoyaltyProgram(completedCard.loyaltyProgramId);
          setLoyaltyProgram(program);
        } catch (error) {
          console.error('Failed to fetch loyalty program:', error);
          setLoyaltyProgram({ name: 'Loyalty Program' } as any);
        }
      };
      
      fetchLoyaltyProgram();
    } else {
      setLoyaltyProgram(null);
    }
  }, [completedCard?.loyaltyProgramId]);

  if (!completionOverlay.isVisible || !completedCard) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Overlay clicked, target:', e.target, 'currentTarget:', e.currentTarget);
    dispatch(hideOverlay());
    dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'));
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Content clicked, stopping propagation');
    e.stopPropagation();
  };

  const handleOkClick = () => {
    console.log('OK button clicked, closing overlay...');
    dispatch(hideOverlay());
    dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'));
  };

  const punchCircles = [];
  for (let i = 0; i < completedCard.totalPunches; i++) {
    punchCircles.push(
      <div
        key={i}
        className={styles.punchCircle}
      ></div>
    );
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <div
        className={styles.content}
        onClick={handleContentClick}
        style={{
          cursor: 'default'
        }}
      >
        <h1 className={styles.completeText}>COMPLETE!!</h1>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.shopName}>{completedCard.shopName}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.punchCirclesContainer}>
                {punchCircles}
              </div>
              {loyaltyProgram && (
                <div className={styles.loyaltyProgramName}>{loyaltyProgram.name}</div>
              )}
            </div>
          </div>
        </div>

        <button className={styles.okButton} onClick={handleOkClick}>
          OK!
        </button>
      </div>
    </div>
  );
};

export default CompletionOverlay; 
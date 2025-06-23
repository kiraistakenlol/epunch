import React from 'react';
import styles from './CompletionOverlay.module.css';
import { handleEvent } from '../../animations/animationSlice';
import { appColors } from '../../../theme';
import { hideOverlay, selectCompletionOverlay } from './completionOverlaySlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { selectPunchCards } from '../../punchCards/punchCardsSlice';
import { selectLoyaltyProgramById } from '../../loyaltyPrograms/loyaltyProgramsSlice';
import { useAppSelector } from '../../../store/hooks';
import PunchCardItem from '../punch-cards/punch-card/PunchCardItem';
import { resolveCardStyles } from '../../../utils/cardStyles';

const CompletionOverlay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const completionOverlay = useAppSelector(selectCompletionOverlay);
  const punchCards = useAppSelector(selectPunchCards);

  // Find the completed card from punch cards slice
  const completedCard = punchCards?.find(card => card.id === completionOverlay.cardId) || null;
  
  // Get loyalty program from the loyalty programs slice
  const loyaltyProgram = useAppSelector((state: RootState) => 
    completedCard?.loyaltyProgramId 
      ? selectLoyaltyProgramById(state, completedCard.loyaltyProgramId)
      : null
  );

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

  const resolvedStyles = resolveCardStyles(completedCard.styles);

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
        backgroundColor: `${appColors.epunchBlack}B3`,
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
          <PunchCardItem
            {...completedCard}
            resolvedStyles={resolvedStyles}
            onCardClick={() => {}} // Disable card clicking in overlay
            hideCompletionOverlay={true}
            disableFlipping={true}
          />
        </div>

        <button className={styles.okButton} onClick={handleOkClick}>
          OK!
        </button>
      </div>
    </div>
  );
};

export default CompletionOverlay; 
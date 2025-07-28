import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './CompletionOverlay.module.css';
import { handleEvent } from '../../animations/animationSlice';
import { appColors } from '../../../theme';
import { hideOverlay, selectCompletionOverlay } from './completionOverlaySlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { selectPunchCards } from '../../punchCards/punchCardsSlice';
import { useAppSelector } from '../../../store/hooks';
import PunchCardItem from '../loyalty-cards/punch-card/PunchCardItem';

const CompletionOverlay: React.FC = () => {
  const { t } = useI18n('punchCards');
  const dispatch = useDispatch<AppDispatch>();
  const completionOverlay = useAppSelector(selectCompletionOverlay);
  const punchCards = useAppSelector(selectPunchCards);

  // Find the completed card from punch cards slice
  const completedCard = punchCards?.find(card => card.id === completionOverlay.cardId) || null;

  if (!completionOverlay.isVisible || !completedCard) {
    return null;
  }

  const handleOverlayClick = () => {
    dispatch(hideOverlay());
    dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'));
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleOkClick = () => {
    dispatch(hideOverlay());
    dispatch(handleEvent('COMPLETION_OVERLAY_CLOSED'));
  };



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
        <h1 className={styles.completeText}>{t('completion.complete')}</h1>

        <div className={styles.cardContainer}>
          <PunchCardItem
            {...completedCard}
            interactive={false}
            selectable={false}
            flippable={false}
            showCompletionOverlay={false}
            enableAnimations={false}
            showShadow={false}
          />
        </div>

        <button className={styles.okButton} onClick={handleOkClick}>
          {t('completion.ok')}
        </button>
      </div>
    </div>
  );
};

export default CompletionOverlay; 
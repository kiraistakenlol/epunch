import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectSelectedCardId, setSelectedCardId, clearSelectedCard, scrollToCard } from '../../../../punchCards/punchCardsSlice';
import { selectIsAuthenticated } from '../../../../auth/authSlice';
import { showAuthModal } from '../../../../auth/authModalSlice';
import styles from './PunchCardOverlay.module.css';

interface PunchCardOverlayProps {
  cardId: string;
}

const PunchCardOverlay: React.FC<PunchCardOverlayProps> = ({ cardId }) => {
  const { t } = useI18n('common');
  const dispatch = useAppDispatch();
  const selectedCardId = useAppSelector(selectSelectedCardId);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isSelected = selectedCardId === cardId;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (isSelected) {
      dispatch(clearSelectedCard());
    } else {
      if (!isAuthenticated) {
        dispatch(showAuthModal('signin'));
        return;
      }

      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
      dispatch(setSelectedCardId(cardId));
      dispatch(scrollToCard(cardId));
    }
  };

  const labelClass = isSelected ? styles.selected : styles.redeemable;
  const text = isSelected ? t('reward.selected') : t('reward.tapToRedeem');

  return (
    <div
      className={styles.container}
    >
      <span
        className={`${styles.label} ${labelClass}`}
        onClick={handleClick}
      >
        {text}
      </span>
    </div>
  );
};

export default PunchCardOverlay; 
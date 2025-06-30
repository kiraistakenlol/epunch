import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectSelectedCardId, setSelectedCardId, clearSelectedCard, scrollToCard } from '../../../../punchCards/punchCardsSlice';
import styles from './PunchCardOverlay.module.css';

interface PunchCardOverlayProps {
  cardId: string;
}

const PunchCardOverlay: React.FC<PunchCardOverlayProps> = ({ cardId }) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const selectedCardId = useAppSelector(selectSelectedCardId);
  const isSelected = selectedCardId === cardId;
  
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isSelected) {
      dispatch(clearSelectedCard());
    } else {
      if (selectedCardId) {
        dispatch(clearSelectedCard());
      }
      dispatch(setSelectedCardId(cardId));
    }
    dispatch(scrollToCard(cardId));
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
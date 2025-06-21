import React from 'react';
import styles from './PunchCardOverlay.module.css';

interface PunchCardOverlayProps {
  isSelected?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

const PunchCardOverlay: React.FC<PunchCardOverlayProps> = ({ isSelected, onClick }) => {
  const labelClass = isSelected ? styles.selected : styles.redeemable;
  const text = isSelected ? 'SELECTED' : 'TAP TO REDEEM';

  return (
    <div 
      className={styles.container}
    >
      <span 
        className={`${styles.label} ${labelClass}`}
        onClick={onClick}
      >
        {text}
      </span>
    </div>
  );
};

export default PunchCardOverlay; 
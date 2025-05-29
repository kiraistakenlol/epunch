import React from 'react';
import { PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core';
import styles from './CompletionOverlay.module.css';

interface CompletionOverlayProps {
  isVisible: boolean;
  completedCard: PunchCardDto | null;
  loyaltyProgram: LoyaltyProgramDto | null;
  onClose: () => void;
}

const CompletionOverlay: React.FC<CompletionOverlayProps> = ({
  isVisible,
  completedCard,
  loyaltyProgram,
  onClose
}) => {
  if (!isVisible || !completedCard) return null;

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
    <div className={styles.overlay}>
      <div className={styles.content}>
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

        <button className={styles.okButton} onClick={onClose}>
          OK!
        </button>
      </div>
    </div>
  );
};

export default CompletionOverlay; 
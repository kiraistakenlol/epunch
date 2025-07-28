import React from 'react';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import PunchCardFrontBodyPunchesSection from './punches/PunchCardFrontBodyPunchesSection';
import styles from './PunchCardFrontBody.module.css';

interface PunchCardFrontBodyProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  loyaltyProgram: LoyaltyProgramDto | null;
  secondaryColor: string;
  punchIcons: {
    filled: NonNullable<any>;
    unfilled: NonNullable<any>;
  };
}

const PunchCardFrontBody: React.FC<PunchCardFrontBodyProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex,
  loyaltyProgram,
  secondaryColor,
  punchIcons
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.punches}>
        <PunchCardFrontBodyPunchesSection
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
          iconColor={secondaryColor}
          punchIcons={punchIcons}
        />
      </div>
      {loyaltyProgram && (
        <div className={styles.loyaltyProgramNameContainer}>
          <div 
            className={styles.loyaltyProgramName}
            style={{ color: secondaryColor }}
          >
            {loyaltyProgram.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchCardFrontBody; 
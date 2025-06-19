import React from 'react';
import PunchCardFrontBodyPunchesSection from './punches/PunchCardFrontBodyPunchesSection';
import styles from './PunchCardFrontBody.module.css';

interface PunchCardFrontBodyProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  loyaltyProgram: any;
  punchIcon?: string | null;
}

const PunchCardFrontBody: React.FC<PunchCardFrontBodyProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex,
  loyaltyProgram
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.punches}>
        <PunchCardFrontBodyPunchesSection
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
        />
      </div>
      {loyaltyProgram && (
        <div className={styles.loyaltyProgramNameContainer}>
          <div className={styles.loyaltyProgramName}>
            {loyaltyProgram.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default PunchCardFrontBody; 
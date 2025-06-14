import React from 'react';
import PunchCardFrontBodyPunchesSection from './PunchCardFrontBodyPunchesSection';
import AutoScaleText from './AutoScaleText';
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
      <div className={styles.punchesSection}>
        <PunchCardFrontBodyPunchesSection
          totalPunches={totalPunches}
          currentPunches={currentPunches}
          animatedPunchIndex={animatedPunchIndex}
        />
      </div>
      <div className={styles.loyaltyProgramSection}>
        {loyaltyProgram && (
          <AutoScaleText 
            className={styles.loyaltyProgramName}
            maxFontSize="1.8em"
            minFontSize="0.1em"
          >
            {loyaltyProgram.name}     
          </AutoScaleText>
        )}
      </div>
    </div>
  );
};

export default PunchCardFrontBody; 
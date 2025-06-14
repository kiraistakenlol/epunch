import React from 'react';
import PunchIconCircle from './PunchIconCircle';
import styles from './PunchCardFrontBodyPunchesSection.module.css';

interface PunchCardFrontBodyPunchesSectionProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
}

const PunchCardFrontBodyPunchesSection: React.FC<PunchCardFrontBodyPunchesSectionProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex
}) => {
  const MAX_PUNCHES = 10;
  const punchCircles: JSX.Element[] = [];

  for (let i = 0; i < MAX_PUNCHES; i++) {
    const isWithinTotal = i < totalPunches;
    const isFilled = i < currentPunches;
    const isAnimated = animatedPunchIndex === i;
    
    let containerClasses = styles.punchIconContainingZone;
    
    if (!isWithinTotal) {
      containerClasses += ` ${styles.punchIconContainingZoneHidden}`;
    }
    
    if (isAnimated) {
      containerClasses += ` ${styles.punchIconContainingZoneAnimated}`;
    }
    
    punchCircles.push(
      <div key={i} className={containerClasses}>
        <PunchIconCircle isFilled={isFilled} />
      </div>
    );
  }

  return (
    <div className={styles.punchCirclesContainer}>
      {punchCircles}
    </div>
  );
};

export default PunchCardFrontBodyPunchesSection; 
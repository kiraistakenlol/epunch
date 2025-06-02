import React from 'react';
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
    
    let circleClasses = styles.punchCircle;
    
    if (!isWithinTotal) {
      circleClasses += ` ${styles.punchCircleHidden}`;
    } else if (isFilled) {
      circleClasses += ` ${styles.punchCircleFilled}`;
    } else {
      circleClasses += ` ${styles.punchCircleEmpty}`;
    }
    
    if (isAnimated) {
      circleClasses += ` ${styles.punchCircleAnimated}`;
    }
    
    punchCircles.push(
      <div
        key={i}
        className={circleClasses}
      ></div>
    );
  }

  return (
    <div className={styles.punchCirclesContainer}>
      {punchCircles}
    </div>
  );
};

export default PunchCardFrontBodyPunchesSection; 
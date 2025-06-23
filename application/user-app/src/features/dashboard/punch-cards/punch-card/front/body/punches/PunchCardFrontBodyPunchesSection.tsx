import React from 'react';
import { CustomizableCardStyles } from '../../../../../../../utils/cardStyles';
import PunchIconSVG from './punch-icon-circle/PunchIconSVG';
import styles from './PunchCardFrontBodyPunchesSection.module.css';

interface PunchCardFrontBodyPunchesSectionProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  resolvedStyles: CustomizableCardStyles;
  showLastFilledPunchAsNotFilled?: boolean;
}

const PunchCardFrontBodyPunchesSection: React.FC<PunchCardFrontBodyPunchesSectionProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex,
  resolvedStyles,
  showLastFilledPunchAsNotFilled
}) => {
  const MAX_PUNCHES = 10;
  const punchCircles: JSX.Element[] = [];

  for (let i = 0; i < MAX_PUNCHES; i++) {
    const isWithinTotal = i < totalPunches;
    const isAnimated = animatedPunchIndex === i;
    
    // Show as filled if:
    // 1. It's a previously filled punch (i < currentPunches - 1), OR
    // 2. It's the current punch being animated (isAnimated), OR
    // 3. It's the current punch and no showLastFilledPunchAsNotFilled flag is set
    const isFilled = i < currentPunches - 1 || 
                     isAnimated || 
                     (i === currentPunches - 1 && !showLastFilledPunchAsNotFilled);
    let containerClasses = styles.punchIconContainingZone;

    if (!isWithinTotal) {
      containerClasses += ` ${styles.punchIconContainingZoneHidden}`;
    }

    if (isAnimated) {
      containerClasses += ` ${styles.punchIconContainingZoneAnimated}`;
    }

    punchCircles.push(
      <div 
        key={i} 
        className={containerClasses}
        style={{ color: resolvedStyles.colors.punchIconColor }}
      >
        <PunchIconSVG 
          svgRawContent={
            isFilled 
              ? resolvedStyles.punchIcons.filled.data.svg_raw_content 
              : resolvedStyles.punchIcons.unfilled.data.svg_raw_content
          }
        />
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
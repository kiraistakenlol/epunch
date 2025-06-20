import React from 'react';
import { CustomizableCardStyles } from '../../../../../../../utils/cardStyles';
import PunchIconSVG from './punch-icon-circle/PunchIconSVG';
import styles from './PunchCardFrontBodyPunchesSection.module.css';

interface PunchCardFrontBodyPunchesSectionProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  resolvedStyles: CustomizableCardStyles;
}

const PunchCardFrontBodyPunchesSection: React.FC<PunchCardFrontBodyPunchesSectionProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex,
  resolvedStyles
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
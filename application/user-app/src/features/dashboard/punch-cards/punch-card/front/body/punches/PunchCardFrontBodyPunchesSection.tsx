import React from 'react';
import { PunchIconsDto } from 'e-punch-common-core';
import PunchIconSVG from './punch-icon-circle/PunchIconSVG';
import styles from './PunchCardFrontBodyPunchesSection.module.css';

// Default SVG content for filled and unfilled circles
const DEFAULT_FILLED_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="currentColor" />
</svg>
`;

const DEFAULT_UNFILLED_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" stroke-width="4" stroke-dasharray="8 4" />
</svg>
`;

interface PunchCardFrontBodyPunchesSectionProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  punchIcons?: PunchIconsDto | null;
}

const PunchCardFrontBodyPunchesSection: React.FC<PunchCardFrontBodyPunchesSectionProps> = ({
  totalPunches,
  currentPunches,
  animatedPunchIndex,
  punchIcons
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
        <PunchIconSVG 
          svgRawContent={
            punchIcons 
              ? (isFilled ? punchIcons.filled.data.svg_raw_content : punchIcons.unfilled.data.svg_raw_content)
              : (isFilled ? DEFAULT_FILLED_SVG : DEFAULT_UNFILLED_SVG)
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
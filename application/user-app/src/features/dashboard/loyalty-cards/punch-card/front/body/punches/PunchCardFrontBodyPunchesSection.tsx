import React from 'react';
import { motion } from 'framer-motion';
import PunchIconSVG from './punch-icon-circle/PunchIconSVG';
import styles from './PunchCardFrontBodyPunchesSection.module.css';
import { appColors } from 'e-punch-common-ui';

interface PunchCardFrontBodyPunchesSectionProps {
  totalPunches: number;
  currentPunches: number;
  animatedPunchIndex?: number;
  punchIcons: {
    filled: NonNullable<any>;
    unfilled: NonNullable<any>;
  };
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
    const isAnimated = animatedPunchIndex === i;
    const isFilled = i < currentPunches;
    
    let containerClasses = styles.punchIconContainingZone;

    if (!isWithinTotal) {
      containerClasses += ` ${styles.punchIconContainingZoneHidden}`;
    }

    punchCircles.push(
      <motion.div 
        key={i} 
        className={containerClasses}
        animate={isAnimated ? {
          scale: [0.8, 1.2, 1],
          color: ['currentColor', appColors.epunchGold, 'currentColor']
        } : {}}
        transition={isAnimated ? {
          duration: 1.5,
          ease: "easeOut",
          times: [0, 0.5, 1]
        } : {}}
      >
        <PunchIconSVG 
          svgRawContent={
            isFilled 
              ? punchIcons.filled.data.svg_raw_content 
              : punchIcons.unfilled.data.svg_raw_content
          }
        />
      </motion.div>
    );
  }

  return (
    <div className={styles.punchCirclesContainer}>
      {punchCircles}
    </div>
  );
};

export default PunchCardFrontBodyPunchesSection; 
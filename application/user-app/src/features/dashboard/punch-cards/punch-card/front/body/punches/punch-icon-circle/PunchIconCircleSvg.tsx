import React from 'react';
import styles from './PunchIconCircleSvg.module.css';

interface PunchIconCircleSvgProps {
  isFilled: boolean;
  className?: string;
}

const PunchIconCircleSvg: React.FC<PunchIconCircleSvgProps> = ({
  isFilled,
  className = ''
}) => (
  <div className={`${styles.punchIconContainer} ${className}`}>
    <svg
      className={styles.punchIconSvg}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isFilled ? (
        // Filled circle
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="currentColor"
          className={styles.filledCircle} />
      ) : (
        // Empty circle with dashed border
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 4"
          className={styles.emptyCircle} />
      )}
    </svg>
  </div>
);

export default PunchIconCircleSvg; 
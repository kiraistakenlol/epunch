import React from 'react';
import SVG from 'react-inlinesvg';
import styles from './PunchIconSVG.module.css';

interface CustomPunchIconProps {
  svgRawContent: string;
  className?: string;
}

const PunchIconSVG: React.FC<CustomPunchIconProps> = ({
  svgRawContent,
  className = ''
}) => {
  return (
    <div className={`${styles.customPunchIconContainer} ${className}`}>
      <SVG
        src={`data:image/svg+xml;base64,${btoa(svgRawContent)}`}
        className={styles.customPunchIconSvg}
      />
    </div>
  );
};

export default PunchIconSVG; 
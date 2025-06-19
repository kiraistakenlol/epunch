import React from 'react';
import { PunchIconsDto } from 'e-punch-common-core';
import SVG from 'react-inlinesvg';
import PunchIconCircleSvg from './PunchIconCircleSvg';
import styles from './CustomPunchIcon.module.css';

interface CustomPunchIconProps {
  isFilled: boolean;
  punchIcons: PunchIconsDto;
  className?: string;
}

const CustomPunchIcon: React.FC<CustomPunchIconProps> = ({
  isFilled,
  punchIcons,
  className = ''
}) => {
  const iconData = isFilled ? punchIcons.filled : punchIcons.unfilled;
  
  if (iconData.type !== 'svg') {
    return <PunchIconCircleSvg isFilled={isFilled} className={className} />;
  }

  return (
    <div className={`${styles.customPunchIconContainer} ${className}`}>
      <SVG
        src={`data:image/svg+xml;base64,${btoa(iconData.data.svg_raw_content)}`}
        className={styles.customPunchIconSvg}
      />
    </div>
  );
};

export default CustomPunchIcon; 
import React from 'react';
import styles from './ScanningFrame.module.css';

interface ScanningFrameProps {
  offsetX?: number;
  offsetY?: number;
  size?: number;
  children?: React.ReactNode;
}

export const ScanningFrame: React.FC<ScanningFrameProps> = ({
  offsetX = 0,
  offsetY = 0,
  size = 200,
  children
}) => {
  const frameStyle = {
    '--frame-offset-x': `${offsetX}px`,
    '--frame-offset-y': `${offsetY}px`,
    '--frame-size': `${size}px`
  } as React.CSSProperties;

  return (
    <>
      <div className={styles.scanningFrame} style={frameStyle}></div>
      {children}
      <div className={styles.scanningCorners} style={frameStyle}>
        <div className={styles.corner} data-position="top-left"></div>
        <div className={styles.corner} data-position="top-right"></div>
        <div className={styles.corner} data-position="bottom-left"></div>
        <div className={styles.corner} data-position="bottom-right"></div>
      </div>
    </>
  );
}; 
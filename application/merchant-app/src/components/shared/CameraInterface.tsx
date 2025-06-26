import React from 'react';
import styles from './CameraInterface.module.css';

interface CameraInterfaceProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CameraInterface: React.FC<CameraInterfaceProps> = ({
  title = 'Camera',
  className = '',
  children
}) => {
  return (
    <div className={`${styles.cameraInterface} ${className}`}>
      <div className={styles.cameraTopBar}>
        <span className={styles.cameraTitle}>{title}</span>
        <div className={styles.cameraControls}>×</div>
      </div>
      <div className={styles.cameraViewfinder}>
        <div className={styles.scanningFrame}></div>
        {children}
        <div className={styles.scanningCorners}>
          <div className={styles.corner} data-position="top-left"></div>
          <div className={styles.corner} data-position="top-right"></div>
          <div className={styles.corner} data-position="bottom-left"></div>
          <div className={styles.corner} data-position="bottom-right"></div>
        </div>
      </div>
      <div className={styles.cameraBottomBar}>
        <div className={styles.cameraButton}></div>
      </div>
    </div>
  );
}; 
import React from 'react';
import styles from './CameraInterface.module.css';
import { ScanningFrame } from './ScanningFrame';

interface CameraInterfaceProps {
  title?: string;
  children?: React.ReactNode;
  frameOffsetX?: number;
  frameOffsetY?: number;
  frameSize?: number;
}

export const CameraInterface: React.FC<CameraInterfaceProps> = ({
  title = 'Camera',
  children,
  frameOffsetX = 0,
  frameOffsetY = 0,
  frameSize = 200
}) => {
  const frameStyle = {
    '--frame-offset-x': `${frameOffsetX}px`,
    '--frame-offset-y': `${frameOffsetY}px`,
    '--frame-size': `${frameSize}px`
  } as React.CSSProperties;

  return (
    <div className={styles.cameraInterface}>
      <div className={styles.cameraTopBar}>
        <span className={styles.cameraTitle}>{title}</span>
        <div className={styles.cameraControls}>×</div>
      </div>
      <div className={styles.cameraViewfinder} style={frameStyle}>
        {/* QR code content rendered in full viewfinder */}
        {children && (
          <div className={styles.qrCodeContainer}>
            {children}
          </div>
        )}
        {/* Scanning frame rendered as overlay */}
        <ScanningFrame 
          offsetX={frameOffsetX}
          offsetY={frameOffsetY}
          size={frameSize}
        />
      </div>
      <div className={styles.cameraBottomBar}>
        <div className={styles.cameraButton}></div>
      </div>
    </div>
  );
}; 
import React from 'react';
import styles from './MerchantScannerPageMockup.module.css';

interface MerchantScannerPageMockupProps {
  children?: React.ReactNode;
  className?: string;
}

export const MerchantScannerPageMockup: React.FC<MerchantScannerPageMockupProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.scannerInterface} ${className}`}>
      <div className={styles.scannerHeader}>
        <h2 className={styles.scannerTitle}>QR Code Scanner</h2>
        <p className={styles.scannerSubtitle}>Point camera at customer QR code</p>
      </div>
      <div className={styles.scannerViewfinder}>
        <div className={styles.scanningFrame}></div>
        {children}
        <div className={styles.scanningCorners}>
          <div className={styles.corner} data-position="top-left"></div>
          <div className={styles.corner} data-position="top-right"></div>
          <div className={styles.corner} data-position="bottom-left"></div>
          <div className={styles.corner} data-position="bottom-right"></div>
        </div>
      </div>
    </div>
  );
}; 
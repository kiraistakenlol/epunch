import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './MerchantScannerPageMockup.module.css';
import { ScanningFrame } from './ScanningFrame';

interface MerchantScannerPageMockupProps {
  children?: React.ReactNode;
  className?: string;
  frameOffsetX?: number;
  frameOffsetY?: number;
  frameSize?: number;
}

export const MerchantScannerPageMockup: React.FC<MerchantScannerPageMockupProps> = ({
  children,
  className = '',
  frameOffsetX = 0,
  frameOffsetY = 0,
  frameSize = 200
}) => {
  const { t } = useI18n('merchantOnboarding');

  return (
    <div className={`${styles.scannerInterface} ${className}`}>
      <div className={styles.scannerHeader}>
        <h2 className={styles.scannerTitle}>{t('merchantInterface.scanner.title')}</h2>
        <p className={styles.scannerSubtitle}>{t('merchantInterface.scanner.subtitle')}</p>
      </div>
      <div className={styles.scannerViewfinder}>
        <ScanningFrame 
          offsetX={frameOffsetX}
          offsetY={frameOffsetY}
          size={frameSize}
        >
          {children}
        </ScanningFrame>
      </div>
    </div>
  );
}; 
import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import styles from './MerchantAppMobileFrameMockup.module.css';

interface MerchantAppMobileFrameMockupProps {
  children?: React.ReactNode;
  className?: string;
  merchant?: MerchantDto;
}

export const MerchantAppMobileFrameMockup: React.FC<MerchantAppMobileFrameMockupProps> = ({
  children,
  className = '',
  merchant}) => {
  return (
    <div className={`${styles.merchantAppMockup} ${className}`}>
      <div className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.hamburgerMenu}>☰</div>
        </div>
        <div className={styles.headerCenter}>
          <div className={styles.appTitle}>ePunch {merchant?.name}</div>
        </div>
      </div>
      <div className={styles.appContent}>
        {children}
      </div>
    </div>
  );
}; 
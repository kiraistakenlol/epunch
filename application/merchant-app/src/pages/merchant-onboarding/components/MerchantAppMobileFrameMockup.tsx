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
  merchant
}) => {
  return (
    <div className={`${styles.merchantAppMockup} ${className}`}>
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.hamburgerMenu}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className={styles.separator}></div>
        </div>
        <div className={styles.headerCenter}>
          <div className={styles.appTitle}>
            ePunch {merchant?.name || 'Merchant'}
          </div>
        </div>
      </header>
      <main className={styles.appContent}>
        {children}
      </main>
    </div>
  );
}; 
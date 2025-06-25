import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  merchant: MerchantDto;
  userAppUrl: string;
  onboardingImageUrl: string | null;
  isGeneratingImage: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  merchant,
  userAppUrl,
  onboardingImageUrl,
  isGeneratingImage
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.brandTitle}>ePunch</div>
          <h1 className={styles.heroTitle}>
            Digital Loyalty Cards<br />
            for <span className={styles.merchantName}>{merchant.name}</span>
          </h1>

          <div className={styles.demoUrl}>
            <p>See it in action:</p>
            <a href={userAppUrl} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
              Try It Now! 🚀
            </a>
          </div>
        </div>

        <div className={styles.heroDemo}>
          <div className={styles.imagePreviewContainer}>
            <h3 className={styles.demoTitle}><span className={styles.merchantName}>{merchant.name}</span> Demo</h3>
            <div className={styles.phoneFrame}>
              <iframe
                src={userAppUrl}
                className={styles.appIframe}
                title={`${merchant.name} Customer Experience`}
                loading="lazy"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}; 
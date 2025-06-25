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
            <a href={userAppUrl} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
              Try It Now! 🚀
            </a>
          </div>
        </div>

        <div className={styles.heroDemo}>
          <div className={styles.problemSolution}>
            <div className={styles.problemCard}>
              <h4 className={styles.problemTitle}>Old Way</h4>
              <div className={styles.physicalCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.merchantName}>{merchant.name}</span>
                  <span className={styles.cardSubtitle}>Loyalty Card</span>
                </div>
                <div className={styles.punchGrid}>
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`${styles.punchHole} ${i < 7 ? styles.punched : ''}`}
                    >
                      {i < 7 ? '●' : '○'}
                    </div>
                  ))}
                </div>
                <div className={styles.cardFooter}>Collect 10 punches for free coffee</div>
              </div>
            </div>
            
            <div className={styles.transformArrow}>
              <div className={styles.arrowHead}>→</div>
            </div>
            
            <div className={styles.solutionCard}>
              <h4 className={styles.solutionTitle}>New Way</h4>
              <div className={styles.phoneFrame}>
                <div className={styles.statusBarArea}></div>
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
      </div>
    </section>
  );
}; 
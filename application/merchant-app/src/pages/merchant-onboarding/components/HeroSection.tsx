import React from 'react';
import { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { PhoneWithUserApp } from '../../../components/shared';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  merchant: MerchantDto;
  userAppUrl: string;
  loyaltyPrograms: LoyaltyProgramDto[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  merchant,
  userAppUrl,
  loyaltyPrograms
}) => {
  const primaryLoyaltyProgram = loyaltyPrograms[0];
  const requiredPunches = primaryLoyaltyProgram?.requiredPunches || 10;
  const currentPunches = Math.floor(requiredPunches * 0.7);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
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
              <div className={styles.physicalCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{merchant.name}</span>
                </div>
                <div className={styles.punchGrid}>
                  {[...Array(requiredPunches)].map((_, i) => (
                    <div
                      key={i}
                      className={`${styles.punchHole} ${i < currentPunches ? styles.punched : ''}`}
                    />
                  ))}
                </div>
                <div className={styles.cardFooter}>Buy 10 Get 1 Free</div>
              </div>
            </div>

            <div className={styles.transformArrow}>
              <div className={styles.arrowHead}>→</div>
            </div>

            <div className={styles.solutionCard}>
              <div className={styles.phoneWithEpunch}>
                <PhoneWithUserApp src={userAppUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
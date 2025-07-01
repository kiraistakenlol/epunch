import React from 'react';
import { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
import { PhoneWithUserApp } from '../../../components/shared';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  merchant: MerchantDto;
  loyaltyProgram: LoyaltyProgramDto;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  merchant,
  loyaltyProgram}) => {
  const { t } = useI18n('merchantOnboarding');
  const requiredPunches = loyaltyProgram.requiredPunches || 10;
  const currentPunches = Math.floor(requiredPunches * 0.7);

  const heroPreviewUrl = `${import.meta.env.VITE_USER_APP_URL}?merchant=${merchant.slug}`;

  return (
    <section id="hero-demo" className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {t('hero.digitalLoyaltyCards')}<br />
              {t('hero.for')} <span className={styles.merchantName}>{merchant.name}</span>
            </h1>

            <div className={styles.demoUrl}>
              <a href={heroPreviewUrl} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
                {t('hero.tryItNow')}
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
                  <div className={styles.cardFooter}>{t('hero.buyGetFree')}</div>
                </div>
              </div>

              <div className={styles.transformArrow}>
                <div className={styles.arrowHead}>→</div>
              </div>

              <div className={styles.solutionCard}>
                <div className={styles.phoneWithEpunch}>
                  <PhoneWithUserApp src={heroPreviewUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}; 
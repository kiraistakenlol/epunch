import React from 'react';
import { MerchantDto, LoyaltyProgramDto, PunchCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { PhoneWithUserApp } from '../../../components/shared';
import { dashboardPreviewService } from '../../../utils/dashboardPreviewService';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  merchant: MerchantDto;
  loyaltyProgram: LoyaltyProgramDto;
  punchCardStyle: PunchCardStyleDto;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  merchant,
  loyaltyProgram,
  punchCardStyle
}) => {
  const requiredPunches = loyaltyProgram.requiredPunches || 10;
  const currentPunches = Math.floor(requiredPunches * 0.7);

  const createMockPunchCard = (id: string, loyaltyProgramId: string, currentPunches: number): PunchCardDto => {
    return {
      id,
      loyaltyProgramId,
      shopName: merchant.name,
      shopAddress: merchant.address || '',
      currentPunches,
      totalPunches: requiredPunches,
      status: currentPunches >= requiredPunches ? 'REWARD_READY' : 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: punchCardStyle
    };
  };

  const heroPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('hero-demo-card', loyaltyProgram.id, currentPunches)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
  });

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Digital Loyalty Cards<br />
            for <span className={styles.merchantName}>{merchant.name}</span>
          </h1>

          <div className={styles.demoUrl}>
            <a href={heroPreviewUrl} target="_blank" rel="noopener noreferrer" className={styles.demoLink}>
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
                <PhoneWithUserApp src={heroPreviewUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
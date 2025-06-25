import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import styles from './BenefitsSection.module.css';

interface BenefitsSectionProps {
  merchant: MerchantDto;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ merchant }) => {
  return (
    <section className={styles.benefits}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Why {merchant.name} Needs Digital Loyalty Cards</h2>
        <div className={styles.benefitsList}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🔄</div>
            <div className={styles.benefitText}>
              <h3>Bring customers back</h3>
              <p>Turn one-time visitors into regulars with gamified rewards</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📱</div>
            <div className={styles.benefitText}>
              <h3>No app downloads needed</h3>
              <p>Customers use it instantly through their web browser</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>⚡</div>
            <div className={styles.benefitText}>
              <h3>Setup in minutes</h3>
              <p>We handle everything - you just scan and reward</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>💰</div>
            <div className={styles.benefitText}>
              <h3>Increase revenue</h3>
              <p>Loyal customers spend 67% more per visit</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
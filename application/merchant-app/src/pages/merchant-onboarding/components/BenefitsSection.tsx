import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import styles from './BenefitsSection.module.css';

interface BenefitsSectionProps {
  merchant: MerchantDto;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ merchant }) => {
  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why {merchant.name} Should Use Digital Loyalty Cards</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>🔄</div>
            <h3 className={styles.cardTitle}>Keep Customers</h3>
            <p className={styles.cardText}><strong>73% higher retention</strong> with loyalty programs.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>💰</div>
            <h3 className={styles.cardTitle}>Make More Money</h3>
            <p className={styles.cardText}>Loyalty customers spend <strong>12-18% more</strong> each year.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>🏆</div>
            <h3 className={styles.cardTitle}>Beat Competition</h3>
            <p className={styles.cardText}><strong>84% of customers</strong> choose businesses with rewards.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>📊</div>
            <h3 className={styles.cardTitle}>Track Results</h3>
            <p className={styles.cardText}>Get <strong>real-time data</strong> on customer behavior.</p>
          </div>
        </div>
      </div>
    </section>
  );
}; 
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
              <h3>Turn One-Time Visitors Into Regulars</h3>
              <p>Give customers a reason to return. Loyalty programs significantly increase repeat visits and customer retention.</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>💰</div>
            <div className={styles.benefitText}>
              <h3>Boost Revenue Per Customer</h3>
              <p><strong>Members of loyalty programs generate 12-18% more revenue per year</strong> and are much more likely to make repeat purchases.</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📱</div>
            <div className={styles.benefitText}>
              <h3>No App Downloads Required</h3>
              <p>Customers use it instantly through their web browser. Zero friction means higher adoption rates.</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>⚡</div>
            <div className={styles.benefitText}>
              <h3>Set Up in Under 5 Minutes</h3>
              <p>Create your first loyalty program today. No technical skills or complicated setup required.</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>📊</div>
            <div className={styles.benefitText}>
              <h3>See What's Working</h3>
              <p>Track which rewards customers love most, peak visit times, and customer retention rates.</p>
            </div>
          </div>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>🎯</div>
            <div className={styles.benefitText}>
              <h3>Build Direct Customer Relationships</h3>
              <p>Connect with customers beyond the transaction. Future updates will enable direct messaging and promotions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
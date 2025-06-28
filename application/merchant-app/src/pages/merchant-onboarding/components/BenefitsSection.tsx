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
        <h2 className={styles.title}>Why {merchant.name} Needs This</h2>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.number}>1</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>Stop the Vanishing Act</h3>
              <p className={styles.itemText}><strong>73% higher retention</strong> (no more ghosting customers)</p>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>2</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>Bigger Bills</h3>
              <p className={styles.itemText}>Loyal customers spend <strong>18% more</strong> per visit</p>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>3</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>Crush Competition</h3>
              <p className={styles.itemText}><strong>84% choose</strong> businesses with rewards over boring ones</p>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>4</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>Know Your People</h3>
              <p className={styles.itemText}>Get <strong>real data</strong> (not just gut feelings)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
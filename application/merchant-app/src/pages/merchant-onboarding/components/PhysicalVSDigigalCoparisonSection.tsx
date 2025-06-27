import React from 'react';
import styles from './PhysicalVSDigigalCoparisonSection.module.css';

export const PhysicalVSDigigalCoparisonSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why Your Customers Don't Come Back</h2>
        <p className={styles.subtitle}>Most businesses lose 70% of customers after the first visit</p>
        
        <div className={styles.problemsGrid}>
          <div className={styles.problem}>
            <div className={styles.problemIcon}>👻</div>
            <h3 className={styles.problemTitle}>One & Done Customers</h3>
            <p className={styles.problemDescription}>
              They buy once, leave happy, but have no reason to choose you over competitors next time.
            </p>
          </div>
          
          <div className={styles.problem}>
            <div className={styles.problemIcon}>🔗</div>
            <h3 className={styles.problemTitle}>No Ongoing Relationship</h3>
            <p className={styles.problemDescription}>
              After they leave, there's no connection. You can't communicate with them or encourage referrals – word-of-mouth happens by chance.
            </p>
          </div>
          
          <div className={styles.problem}>
            <div className={styles.problemIcon}>📉</div>
            <h3 className={styles.problemTitle}>Missing Revenue</h3>
            <p className={styles.problemDescription}>
              Without loyalty programs, you're leaving money on the table. Loyal customers are worth significantly more over time.
            </p>
          </div>
        </div>
        
        <div className={styles.solutionTeaser}>
          <div className={styles.arrow}>↓</div>
          <p className={styles.teaserText}>
            <strong>What if you could turn every customer into a regular?</strong>
          </p>
        </div>
      </div>
    </section>
  );
}; 
import React from 'react';
import styles from './SocialProofSection.module.css';

export const SocialProofSection: React.FC = () => {
  return (
    <section className={styles.socialProof}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Join Other Successful Businesses</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>73%</div>
            <div className={styles.statLabel}>Higher retention rates</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>20%</div>
            <div className={styles.statLabel}>More frequent visits</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>67%</div>
            <div className={styles.statLabel}>Increased spending</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
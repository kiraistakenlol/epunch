import React from 'react';
import styles from './SocialProofSection.module.css';

export const SocialProofSection: React.FC = () => {
  return (
    <section className={styles.socialProof}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>The Numbers Don't Lie</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>73%</div>
            <div className={styles.statLabel}>Stop ghosting you</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>20%</div>
            <div className={styles.statLabel}>Come back more often</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>67%</div>
            <div className={styles.statLabel}>Spend more money</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
import React from 'react';
import styles from './FuturePlansSection.module.css';

export const FuturePlansSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Future Plans</h2>
        <div className={styles.placeholder}>
          <p>Future plans section content coming soon...</p>
        </div>
      </div>
    </section>
  );
}; 
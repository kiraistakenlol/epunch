import React from 'react';
import styles from './FeaturesSection.module.css';

export const FeaturesSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.placeholder}>
          <p>Features section content coming soon...</p>
        </div>
      </div>
    </section>
  );
}; 
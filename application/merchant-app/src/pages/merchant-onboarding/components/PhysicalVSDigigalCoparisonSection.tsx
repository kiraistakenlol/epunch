import React from 'react';
import styles from './PhysicalVSDigigalCoparisonSection.module.css';

export const PhysicalVSDigigalCoparisonSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h3>Physical vs Digital</h3>
        <p className={styles.subtitle}>See the difference for your business</p>
        
        <div className={styles.comparison}>
          <div className={styles.physical}>
            <div className={styles.header}>
              <h4>Traditional Paper</h4>
            </div>
            <ul>
              <li>Can be forgotten or lost</li>
              <li>Costs to print and replace</li>
              <li>No analytics</li>
              <li>Takes up counter space</li>
            </ul>
          </div>
          
          <div className={styles.vsElement}>
            <span>VS</span>
          </div>
          
          <div className={styles.digital}>
            <div className={styles.header}>
              <h4>Digital Solution</h4>
            </div>
            <ul>
              <li>Always in customer's phone</li>
              <li>Zero printing costs</li>
              <li>Real-time analytics</li>
              <li>Instant customer engagement</li>
            </ul>
            <span className={styles.recommended}>Recommended</span>
          </div>
        </div>
      </div>
    </section>
  );
}; 
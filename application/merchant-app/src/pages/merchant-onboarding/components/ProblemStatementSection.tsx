import React from 'react';
import styles from './ProblemStatementSection.module.css';

export const ProblemStatementSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.problemStatement}>
          <h2 className={styles.problemLabel}>THE PROBLEM:</h2>
          <h1 className={styles.problemTitle}>70% of customers never come back!</h1>
        </div>
        
        <div className={styles.solutionTeaser}>
          <div className={styles.arrow}>↓</div>
          <p className={styles.teaserText}>
            <strong>What if every customer became a regular?</strong>
          </p>
        </div>
      </div>
    </section>
  );
}; 
import React from 'react';
import styles from './ProblemSolutionSection.module.css';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Problem Card */}
        <div className={styles.problemCard}>
          <div className={styles.cardHeader}>
            <span className={styles.problemBadge}>Problem</span>
          </div>
          <h2 className={styles.problemTitle}>Customers visit once, then vanish forever</h2>
          <p className={styles.problemDescription}>
            Like Tinder dates, 70% never come back. They forget you exist and swipe right on your competitors.
          </p>
        </div>

        {/* Solution Card */}
        <div className={styles.solutionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.solutionBadge}>Solution</span>
          </div>
          <div className={styles.brandReveal}>
            <h1 className={styles.brandName}>ePunch</h1>
            <p className={styles.brandTagline}>Turn one-time visitors into obsessed regulars</p>
            <p className={styles.brandDescription}>
              Digital loyalty cards that actually work. No apps, no hassle, no "sorry we're out of paper cards." 
              Just scan and watch them keep coming back.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}; 
import React from 'react';
import styles from './FeaturesSection.module.css';

export const FeaturesSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Simple Digital Loyalty That Works</h2>
        <p className={styles.sectionSubtitle}>
          Start your first loyalty program in minutes. No technical skills required.
        </p>
        
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>5-Minute Setup</h3>
            <p className={styles.featureDescription}>
              Create your first loyalty program instantly. Just scan customer QR codes and start rewarding.
            </p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Multiple Programs</h3>
            <p className={styles.featureDescription}>
              Coffee rewards, meal deals, service packages - create different programs for different products.
            </p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>Your Brand Style</h3>
            <p className={styles.featureDescription}>
              Custom colors, logo, and card designs that match your business personality.
            </p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>See What Works</h3>
            <p className={styles.featureDescription}>
              Track which rewards customers love most, peak visit times, and program performance.
            </p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎮</div>
            <h3 className={styles.featureTitle}>Fun for Customers</h3>
            <p className={styles.featureDescription}>
              Animated punch cards and progress tracking make earning rewards exciting and engaging.
            </p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💸</div>
            <h3 className={styles.featureTitle}>Zero Ongoing Costs</h3>
            <p className={styles.featureDescription}>
              No printing, no plastic cards, no lost rewards. Everything lives in customers' phones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 
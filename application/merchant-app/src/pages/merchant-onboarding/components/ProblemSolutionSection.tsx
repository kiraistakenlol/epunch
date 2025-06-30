import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProblemSolutionSection.module.css';

export const ProblemSolutionSection: React.FC = () => {
  const { t } = useTranslation('merchantOnboarding');
  
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Problem Card */}
        <div className={styles.problemCard}>
          <div className={styles.cardHeader}>
            <span className={styles.problemBadge}>{t('problemSolution.problem')}</span>
          </div>
          <h2 className={styles.problemTitle}>{t('problemSolution.problemTitle')}</h2>
          <p className={styles.problemDescription}>
            {t('problemSolution.problemDescription')}
          </p>
        </div>

        {/* Solution Card */}
        <div className={styles.solutionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.solutionBadge}>{t('problemSolution.solution')}</span>
          </div>
          <div className={styles.brandReveal}>
            <h1 className={styles.brandName}>ePunch</h1>
            <p className={styles.brandTagline}>{t('problemSolution.brandTagline')}</p>
            <p className={styles.brandDescription}>
              {t('problemSolution.brandDescription')}
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}; 
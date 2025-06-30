import React from 'react';
import { useLocalization } from 'e-punch-common-ui';
import styles from './ProblemSolutionSection.module.css';

export const ProblemSolutionSection: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Problem Card */}
        <div className={styles.problemCard}>
          <div className={styles.cardHeader}>
            <span className={styles.problemBadge}>{t('merchantOnboarding.problemSolution.problem')}</span>
          </div>
          <h2 className={styles.problemTitle}>{t('merchantOnboarding.problemSolution.problemTitle')}</h2>
          <p className={styles.problemDescription}>
            {t('merchantOnboarding.problemSolution.problemDescription')}
          </p>
        </div>

        {/* Solution Card */}
        <div className={styles.solutionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.solutionBadge}>{t('merchantOnboarding.problemSolution.solution')}</span>
          </div>
          <div className={styles.brandReveal}>
            <h1 className={styles.brandName}>ePunch</h1>
            <p className={styles.brandTagline}>{t('merchantOnboarding.problemSolution.brandTagline')}</p>
            <p className={styles.brandDescription}>
              {t('merchantOnboarding.problemSolution.brandDescription')}
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}; 
import React from 'react';
import { useLocalization } from 'e-punch-common-ui';
import styles from './SocialProofSection.module.css';

export const SocialProofSection: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <section className={styles.socialProof}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{t('merchantOnboarding.socialProof.title')}</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>73%</div>
            <div className={styles.statLabel}>{t('merchantOnboarding.socialProof.retention.label')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>20%</div>
            <div className={styles.statLabel}>{t('merchantOnboarding.socialProof.frequency.label')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>67%</div>
            <div className={styles.statLabel}>{t('merchantOnboarding.socialProof.spending.label')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
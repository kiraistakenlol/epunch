import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './SocialProofSection.module.css';

export const SocialProofSection: React.FC = () => {
  const { t } = useI18n('merchantOnboarding');
  
  return (
    <section className={styles.socialProof}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{t('socialProof.title')}</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>73%</div>
            <div className={styles.statLabel}>{t('socialProof.retention.label')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>20%</div>
            <div className={styles.statLabel}>{t('socialProof.frequency.label')}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>67%</div>
            <div className={styles.statLabel}>{t('socialProof.spending.label')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
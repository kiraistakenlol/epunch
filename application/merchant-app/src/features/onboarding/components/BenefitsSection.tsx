import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
import styles from './BenefitsSection.module.css';

interface BenefitsSectionProps {
  merchant: MerchantDto;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ merchant }) => {
  const { t } = useI18n('merchantOnboarding');
  
  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('benefits.title', { merchantName: merchant.name })}</h2>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.number}>1</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{t('benefits.retention.title')}</h3>
              <p className={styles.itemText} dangerouslySetInnerHTML={{ __html: t('benefits.retention.description') }} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>2</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{t('benefits.spending.title')}</h3>
              <p className={styles.itemText} dangerouslySetInnerHTML={{ __html: t('benefits.spending.description') }} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>3</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{t('benefits.competition.title')}</h3>
              <p className={styles.itemText} dangerouslySetInnerHTML={{ __html: t('benefits.competition.description') }} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.number}>4</div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{t('benefits.data.title')}</h3>
              <p className={styles.itemText} dangerouslySetInnerHTML={{ __html: t('benefits.data.description') }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 
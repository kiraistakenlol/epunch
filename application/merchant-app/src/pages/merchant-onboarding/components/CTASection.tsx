import React from 'react';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { MerchantDto } from 'e-punch-common-core';
import { useLocalization } from 'e-punch-common-ui';
import styles from './CTASection.module.css';

interface CTASectionProps {
  merchant: MerchantDto;
}

export const CTASection: React.FC<CTASectionProps> = ({ merchant }) => {
  const { t } = useLocalization();
  
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>{t('merchantOnboarding.cta.title', { merchantName: merchant.name })}</h2>
        <p className={styles.ctaSubtitle}>
          {t('merchantOnboarding.cta.subtitle')}
        </p>
        <div className={styles.contactButtons}>
          <a href="https://wa.me/79250419362" className={styles.primaryButton}>
            <FaWhatsapp /> {t('merchantOnboarding.cta.whatsapp')}
          </a>
          <a href="mailto:hello@epunch.app" className={styles.secondaryButton}>
            <FaEnvelope /> {t('merchantOnboarding.cta.email')}
          </a>
        </div>
        <div className={styles.contactInfo}>
          <p>hello@epunch.app</p>
        </div>
      </div>
    </section>
  );
}; 
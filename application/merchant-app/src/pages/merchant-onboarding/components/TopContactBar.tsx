import React from 'react';
import { FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { LanguageSwitch, useLocalization } from 'e-punch-common-ui';
import styles from './TopContactBar.module.css';

export const TopContactBar: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className={styles.topContact}>
      <div className={styles.topContactContent}>
        <a href="https://wa.me/79250419362" className={styles.topContactLink}>
          <FaWhatsapp /> {t('merchantOnboarding.contact.whatsapp')}
        </a>
        <span> | </span>
        <a href="https://t.me/sobolevchelovek" className={styles.topContactLink}>
          <FaTelegram /> {t('merchantOnboarding.contact.telegram')}
        </a>
        <span> | </span>
        <a href="mailto:hello@epunch.app" className={styles.topContactLink}>
          <FaEnvelope /> {t('merchantOnboarding.contact.email')}
        </a>
        <span> | </span>
        <LanguageSwitch variant="landing" />
      </div>
    </div>
  );
}; 
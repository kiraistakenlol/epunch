import React from 'react';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { LanguageSwitch } from 'e-punch-common-ui';
import styles from './TopContactBar.module.css';

export const TopContactBar: React.FC = () => {
  return (
    <div id="top-contact-bar" className={styles.topContact}>
      <div className={styles.topContactContent}>
        <div className={styles.brandSection}>
          <span className={styles.brandName}>ePunch</span>
        </div>
        <div className={styles.contactSection}>
          <span className={styles.workWithUs}>Work with us:</span>
          <a href="https://wa.me/79250419362" className={styles.topContactLink}>
            <FaWhatsapp />
          </a>
          <a href="mailto:hello@epunch.app" className={styles.topContactLink}>
            <FaEnvelope />
          </a>
          <div className={styles.languageSwitch}>
            <LanguageSwitch variant="landing" />
          </div>
        </div>
      </div>
    </div>
  );
}; 
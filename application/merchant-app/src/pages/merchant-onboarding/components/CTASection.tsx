import React from 'react';
import { FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { MerchantDto } from 'e-punch-common-core';
import styles from './CTASection.module.css';

interface CTASectionProps {
  merchant: MerchantDto;
}

export const CTASection: React.FC<CTASectionProps> = ({ merchant }) => {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Ready to Make {merchant.name} Addictive?</h2>
        <p className={styles.ctaSubtitle}>
          Hit us up and let's turn those one-time visitors into obsessed regulars
        </p>
        <div className={styles.contactButtons}>
          <a href="https://wa.me/79250419362" className={styles.primaryButton}>
            <FaWhatsapp /> Let's Chat on WhatsApp
          </a>
          <a href="https://t.me/sobolevchelovek" className={styles.secondaryButton}>
            <FaTelegram /> Slide Into Our Telegram
          </a>
          <a href="mailto:hello@epunch.app" className={styles.secondaryButton}>
            <FaEnvelope /> Good Old Email
          </a>
        </div>
        <div className={styles.contactInfo}>
          <p>@sobolevchelovek | hello@epunch.app</p>
        </div>
      </div>
    </section>
  );
}; 
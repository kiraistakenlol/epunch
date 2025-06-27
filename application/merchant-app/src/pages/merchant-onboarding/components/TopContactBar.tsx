import React from 'react';
import { FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';
import styles from './TopContactBar.module.css';

export const TopContactBar: React.FC = () => {
  return (
    <div className={styles.topContact}>
      <div className={styles.topContactContent}>
        <span>Get started with ePunch: </span>
        <a href="https://wa.me/79250419362" className={styles.topContactLink}>
          <FaWhatsapp /> WhatsApp
        </a>
        <span> | </span>
        <a href="https://t.me/sobolevchelovek" className={styles.topContactLink}>
          <FaTelegram /> Telegram
        </a>
        <span> | </span>
        <a href="mailto:hello@epunch.app" className={styles.topContactLink}>
          <FaEnvelope /> Email
        </a>
      </div>
    </div>
  );
}; 
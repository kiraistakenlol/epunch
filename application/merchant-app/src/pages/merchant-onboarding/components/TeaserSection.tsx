import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
import styles from './TeaserSection.module.css';

interface TeaserSectionProps {
  merchant: MerchantDto;
}

export const TeaserSection: React.FC<TeaserSectionProps> = ({ merchant }) => {
  const { t } = useI18n('merchantOnboarding');
  
  const scrollToDemo = () => {
    const demoElement = document.getElementById('hero-demo');
    if (demoElement) {
      const topContactBar = document.getElementById('top-contact-bar');
      const headerHeight = topContactBar ? topContactBar.getBoundingClientRect().height : 100;
      const bufferSpace = 20;
      const headerOffset = headerHeight + bufferSpace;
      
      const elementPosition = demoElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={styles.teaser}>
      <div className={styles.teaserContent}>
        <h1 className={styles.teaserTitle}>
          {t('teaser.titlePrefix')} <span className={styles.merchantName}>{merchant.name}</span> {t('teaser.titleSuffix')}
        </h1>
        <button className={styles.tellMeButton} onClick={scrollToDemo}>
          {t('teaser.button')}
        </button>
        <div className={styles.scrollArrow}>
          <div className={styles.arrowDown} onClick={scrollToDemo}>↓</div>
        </div>
      </div>
    </section>
  );
}; 
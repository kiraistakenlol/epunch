import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  merchantSlug: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ merchantSlug }) => {
  const { t } = useTranslation('merchantOnboarding');
  
  return (
    <div className={styles.errorContainer}>
      <h1>{t('error.merchantNotFound')}</h1>
      <p>{t('error.merchantNotFoundMessage', { merchantSlug })}</p>
    </div>
  );
}; 
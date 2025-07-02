import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  merchantSlug: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ merchantSlug }) => {
  const { t } = useI18n('merchantOnboarding');
  
  return (
    <div className={styles.errorContainer}>
      <h1>{t('error.merchantNotFound')}</h1>
      <p>{t('error.merchantNotFoundMessage', { merchantSlug })}</p>
    </div>
  );
}; 
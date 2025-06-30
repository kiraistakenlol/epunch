import React from 'react';
import { useLocalization } from 'e-punch-common-ui';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  merchantSlug: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ merchantSlug }) => {
  const { t } = useLocalization();
  
  return (
    <div className={styles.errorContainer}>
      <h1>{t('merchantOnboarding.error.merchantNotFound')}</h1>
      <p>{t('merchantOnboarding.error.merchantNotFoundMessage', { merchantSlug })}</p>
    </div>
  );
}; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './LoadingState.module.css';

export const LoadingState: React.FC = () => {
  const { t } = useTranslation('merchantOnboarding');
  
  return (
    <div className={styles.loadingContainer}>
      <EpunchSpinner size="lg" />
      <p>{t('loading.merchantInformation')}</p>
    </div>
  );
}; 
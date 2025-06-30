import React from 'react';
import { useLocalization } from 'e-punch-common-ui';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './LoadingState.module.css';

export const LoadingState: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className={styles.loadingContainer}>
      <EpunchSpinner size="lg" />
      <p>{t('merchantOnboarding.loading.merchantInformation')}</p>
    </div>
  );
}; 
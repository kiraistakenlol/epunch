import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './LoadingState.module.css';

export const LoadingState: React.FC = () => {
  const { t } = useI18n('merchantOnboarding');
  
  return (
    <div className={styles.loadingContainer}>
      <EpunchSpinner size="lg" />
      <p>{t('loading.merchantInformation')}</p>
    </div>
  );
}; 
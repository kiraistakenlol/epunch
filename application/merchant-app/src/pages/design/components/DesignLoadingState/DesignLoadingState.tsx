import React from 'react';
import { EpunchSpinner } from '../../../../components/foundational';
import styles from './DesignLoadingState.module.css';

export const DesignLoadingState: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <EpunchSpinner size="lg" />
      <p className={styles.loadingMessage}>
        Loading style settings...
      </p>
    </div>
  );
}; 
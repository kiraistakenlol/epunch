import React from 'react';
import { EpunchSpinner } from '../../../components/foundational';
import styles from './LoadingState.module.css';

export const LoadingState: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <EpunchSpinner size="lg" />
      <p>Loading merchant information...</p>
    </div>
  );
}; 
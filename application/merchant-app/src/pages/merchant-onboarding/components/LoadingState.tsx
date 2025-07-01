import React from 'react';
import { PulseLoader } from 'react-spinners';
import styles from './LoadingState.module.css';

export const LoadingState: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <PulseLoader size={15} color="#333" />
    </div>
  );
}; 
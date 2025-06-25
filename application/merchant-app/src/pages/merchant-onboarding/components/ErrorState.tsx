import React from 'react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  merchantSlug: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ merchantSlug }) => {
  return (
    <div className={styles.errorContainer}>
      <h1>Merchant Not Found</h1>
      <p>The merchant "{merchantSlug}" could not be found.</p>
    </div>
  );
}; 
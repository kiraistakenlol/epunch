import React from 'react';
import styles from './EpunchSpinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  text?: string;
}

export const EpunchSpinner: React.FC<SpinnerProps> = ({
  size = 'lg',
  variant = 'primary',
  text
}) => {
  return (
    <div className={`${styles.spinnerWrapper} ${styles[`spinner-${size}`]} ${styles[`spinner-${variant}`]}`}>
      <div className={styles.spinnerContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
      {text && (
        <p className={styles.spinnerText}>{text}</p>
      )}
    </div>
  );
}; 
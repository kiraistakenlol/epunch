import React from 'react';
import styles from './MerchantActionButton.module.css';

interface MerchantActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MerchantActionButton: React.FC<MerchantActionButtonProps> = ({
  children,
  onClick,
  className = ''
}) => {
  return (
    <div className={styles.actionButtonContainer}>
      <div className={`${styles.actionButton} ${className}`} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}; 
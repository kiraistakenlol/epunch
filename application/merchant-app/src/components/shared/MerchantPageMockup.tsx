import React from 'react';
import styles from './MerchantPageMockup.module.css';

interface MerchantPageMockupProps {
  children: React.ReactNode;
  className?: string;
}

export const MerchantPageMockup: React.FC<MerchantPageMockupProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.mockupContent} ${className}`}>
      {children}
    </div>
  );
}; 
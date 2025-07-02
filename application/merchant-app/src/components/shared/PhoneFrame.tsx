import React from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
}) => {

  return (
    <div className={styles.phoneFrame}>
      {children}
    </div>
  );
}; 
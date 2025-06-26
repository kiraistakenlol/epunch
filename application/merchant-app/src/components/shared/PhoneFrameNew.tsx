import React from 'react';
import styles from './PhoneFrameNew.module.css';

interface PhoneFrameNewProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrameNew: React.FC<PhoneFrameNewProps> = ({
  children,
  className = ''
}) => {
  const frameClasses = [styles.phoneFrame, className].filter(Boolean).join(' ');

  return (
    <div className={frameClasses}>
      {children}
    </div>
  );
}; 
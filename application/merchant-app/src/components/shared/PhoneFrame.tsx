import React from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
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
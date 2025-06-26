import React from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  src?: string;
  title?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  children?: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  src,
  title,
  className = '',
  loading = 'lazy',
  children
}) => {
  const frameClasses = [styles.phoneFrame, className].filter(Boolean).join(' ');

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (src) {
      return (
        <>
          <div className={styles.statusBarArea}></div>
          <iframe
            src={src}
            className={styles.appIframe}
            title={title || 'Phone App Content'}
            loading={loading}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className={frameClasses}>
      {renderContent()}
    </div>
  );
}; 
import React from 'react';
import styles from './UserAppIframeView.module.css';

interface UserAppIframeViewProps {
  src: string;
  title?: string;
  loading?: 'lazy' | 'eager';
}

export const UserAppIframeView: React.FC<UserAppIframeViewProps> = ({
  src,
  loading = 'lazy'
}) => {
  return (
    <div className={styles.iframeContainer}>
      <iframe
        src={src}
        className={styles.iframe}
        loading={loading}
      />
    </div>
  );
}; 
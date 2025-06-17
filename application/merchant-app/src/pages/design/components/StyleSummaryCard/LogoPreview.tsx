import React from 'react';
import { ImageOutlined } from '@mui/icons-material';
import styles from './LogoPreview.module.css';

interface LogoPreviewProps {
  logoUrl?: string | null;
}

export const LogoPreview: React.FC<LogoPreviewProps> = ({ logoUrl }) => {
  return (
    <div className={styles.logoPreview}>
      <div className={styles.logoContainer}>
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Current logo" 
            className={styles.logoImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
            }}
          />
        ) : null}
        
        <div className={`${styles.logoPlaceholder} ${logoUrl ? styles.hidden : ''}`}>
          <ImageOutlined className={styles.placeholderIcon} />
          <span className={styles.placeholderText}>No Logo</span>
        </div>
      </div>
      
      {logoUrl && (
        <div className={styles.logoInfo}>
          <span className={styles.logoStatus}>✓ Logo uploaded</span>
        </div>
      )}
    </div>
  );
}; 
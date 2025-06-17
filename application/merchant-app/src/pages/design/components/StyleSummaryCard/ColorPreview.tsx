import React from 'react';
import styles from './ColorPreview.module.css';

interface ColorPreviewProps {
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export const ColorPreview: React.FC<ColorPreviewProps> = ({
  primaryColor,
  secondaryColor
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.colorRow}>
        <div 
          className={styles.colorSwatch}
          style={{ backgroundColor: primaryColor || '#5d4037' }}
        />
        <span className={styles.colorLabel}>Primary</span>
      </div>
      <div className={styles.colorRow}>
        <div 
          className={styles.colorSwatch}
          style={{ backgroundColor: secondaryColor || '#795548' }}
        />
        <span className={styles.colorLabel}>Secondary</span>
      </div>
    </div>
  );
}; 
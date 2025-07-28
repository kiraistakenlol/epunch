import React from 'react';
import styles from './PunchCardFrontFooter.module.css';

interface PunchCardFrontFooterProps {
  logoUrl?: string | null;
}

const PunchCardFrontFooter: React.FC<PunchCardFrontFooterProps> = ({ logoUrl }) => (
  <div className={styles.container}>
    {logoUrl && (
      <img src={logoUrl} alt="Logo" className={styles.logo} />
    )}
  </div>
);

export default PunchCardFrontFooter; 
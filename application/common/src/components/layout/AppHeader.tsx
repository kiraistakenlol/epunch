import React from 'react';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "E PUNCH.IO" }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>{title}</div>
    </header>
  );
};

export default AppHeader; 
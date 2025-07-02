import React from 'react';
import styles from './TwoScreenFlow.module.css';

interface TwoScreenFlowProps {
  firstScreen: React.ReactNode;
  secondScreen: React.ReactNode;
  className?: string;
}

export const TwoScreenFlow: React.FC<TwoScreenFlowProps> = ({
  firstScreen,
  secondScreen,
  className = ''
}) => {
  return (
    <div className={`${styles.twoScreenFlow} ${className}`}>
      <div className={styles.firstScreen}>
        {firstScreen}
      </div>
      
      <div className={styles.resultArrow}>→</div>
      
      <div className={styles.secondScreen}>
        {secondScreen}
      </div>
    </div>
  );
}; 
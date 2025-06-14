import React from 'react';
import styles from './PunchIconCircle.module.css';

interface PunchIconCircleProps {
  isFilled: boolean;
  className?: string;
}

const PunchIconCircle: React.FC<PunchIconCircleProps> = ({
  isFilled,
  className = ''
}) => {
  let iconClasses = styles.punchIcon;
  
  if (isFilled) {
    iconClasses += ` ${styles.punchIconFilled}`;
  } else {
    iconClasses += ` ${styles.punchIconEmpty}`;
  }
  
  if (className) {
    iconClasses += ` ${className}`;
  }

  return <div className={iconClasses}></div>;
};

export default PunchIconCircle; 
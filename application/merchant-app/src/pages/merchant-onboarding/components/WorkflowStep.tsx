import React from 'react';
import styles from './WorkflowStep.module.css';

interface WorkflowStepProps {
  stepNumber: number;
  role: 'you' | 'customer';
  title: string;
  children: React.ReactNode;
  note?: string;
  showArrow?: boolean;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  stepNumber,
  role,
  title,
  children,
  note,
  showArrow = false
}) => {
  return (
    <>
      <div className={styles.step}>
        <div className={styles.stepNumber}>{stepNumber}</div>
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <div className={styles.roleTag} data-role={role}>
              {role === 'you' ? 'YOU' : 'CUSTOMER'}
            </div>
            <h3>{title}</h3>
          </div>
          <div className={styles.stepVisual}>
            {children}
            {note && <p className={styles.stepNote}>{note}</p>}
          </div>
        </div>
      </div>
      {showArrow && (
        <div className={styles.stepArrow}>
          <div className={styles.arrowDown}>↓</div>
        </div>
      )}
    </>
  );
}; 
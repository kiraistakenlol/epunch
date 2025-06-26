import React from 'react';
import styles from './WorkflowStep.module.css';

export const CLIENT_NAME = 'your client';

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
        <div className={styles.stepNumber}>{stepNumber}.</div>
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <div className={styles.stepAvatarContainer} data-role={role}>
              <img 
                src={role === 'you' ? '/images/worker.png' : '/images/client.png'} 
                alt={role === 'you' ? 'Business Owner' : 'Customer'}
                className={styles.stepAvatar}
              />
              <div className={styles.stepRoleLabel}>
                {role === 'you' ? 'YOU' : CLIENT_NAME.toUpperCase()}
              </div>
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
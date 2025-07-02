import React, { useState } from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './WorkflowStep.module.css';

interface WorkflowStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children?: React.ReactNode;
  isLast?: boolean;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  stepNumber,
  title,
  description,
  children,
  isLast = false
}) => {
  const { t } = useI18n('merchantOnboarding');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.stepContainer}>
      <div 
        className={`${styles.step} ${children ? styles.clickable : ''}`}
        onClick={children ? toggleExpanded : undefined}
      >
        <div className={styles.stepNumber}>{stepNumber}</div>
        <div className={styles.stepContent}>
          <h3 className={styles.stepTitle}>{title}</h3>
          <p className={styles.stepDescription}>{description}</p>
        </div>
        {children && (
          <button 
            className={styles.moreDetailsButton}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
            type="button"
          >
            {t('howItWorks.moreDetails')}
            <span className={styles.arrowIcon}>
              {isExpanded ? '↑' : '↓'}
            </span>
          </button>
        )}
      </div>
      {isExpanded && children && (
        <div className={styles.expandedContent}>
          {children}
        </div>
      )}
      {!isLast && <div className={styles.stepSeparator} />}
    </div>
  );
}; 
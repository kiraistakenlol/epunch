import React, { useState } from 'react';
import { useI18n } from 'e-punch-common-ui';
import styles from './WorkflowStep.module.css';

export const CLIENT_NAME = 'client';

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
  const { t } = useI18n('merchantOnboarding');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const roleBadgeText = role === 'you' ? t('howItWorks.roleBadge.you') : t('howItWorks.roleBadge.customer');
  const roleColor = role === 'you' ? 'merchant' : 'customer';

  return (
    <div className={styles.stepContainer}>
      <div className={`${styles.step} ${isExpanded ? styles.expanded : ''}`}>
        
        {/* Role Badge - Outside Frame */}
        <div className={`${styles.roleBadge} ${styles[roleColor]} ${isExpanded ? styles.badgeExpanded : styles.badgeCollapsed}`}>
          <span className={styles.roleText}>{roleBadgeText}</span>
        </div>

        {/* Step Header - Always Visible */}
        <div className={styles.stepHeader} onClick={toggleExpanded}>
          <div className={styles.stepMeta}>
            <div className={styles.stepNumber}>{stepNumber}</div>
          </div>
          
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>{title}</h3>
            {note && !isExpanded && (
              <p className={styles.stepPreview}>{note}</p>
            )}
          </div>
          
          <div className={styles.expandToggle}>
            <div className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Step Details - Expandable */}
        {isExpanded && (
          <div className={styles.stepDetails}>
            <div className={styles.stepVisual}>
              {children}
            </div>
            {note && (
              <div className={styles.stepNote}>
                <span className={styles.noteIcon}>💡</span>
                <p>{note}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Connection Line */}
      {showArrow && (
        <div className={styles.stepConnection}>
          <div className={styles.connectionLine}></div>
          <div className={styles.connectionArrow}>↓</div>
        </div>
      )}
    </div>
  );
}; 
import React from 'react';
import { EpunchCard } from '../layout/EpunchCard';
import { showErrorToast } from '../../../utils/toast';
import styles from './FormContainer.module.css';

export interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText: string;
  submittingText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  error?: string | null;
  variant?: 'card' | 'plain';
  fieldSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xxl';
  showCancelButton?: boolean;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
  onCancel,
  submitText,
  submittingText,
  cancelText = 'Cancel',
  isSubmitting = false,
  error,
  variant = 'card',
  fieldSpacing = 'md',
  showCancelButton = true
}) => {
  React.useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const getFieldSpacingClass = () => {
    switch (fieldSpacing) {
      case 'xs': return styles['formFields-xs'];
      case 'sm': return styles['formFields-sm'];
      case 'md': return styles['formFields-md'];
      case 'lg': return styles['formFields-lg'];
      case 'xxl': return styles['formFields-xxl'];
      default: return styles['formFields-md'];
    }
  };

  const formContent = (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <div className={`${styles.formFields} ${getFieldSpacingClass()}`}>
        {children}
      </div>
      
      <div className={styles.formActions}>
        {showCancelButton && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (submittingText || 'Submitting...') : submitText}
        </button>
      </div>
    </form>
  );

  return variant === 'card' ? (
    <EpunchCard>{formContent}</EpunchCard>
  ) : (
    formContent
  );
}; 
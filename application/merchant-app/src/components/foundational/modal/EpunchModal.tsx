import React, { useEffect } from 'react';
import styles from './EpunchModal.module.css';

export interface EpunchModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const EpunchModal: React.FC<EpunchModalProps> = ({
  open,
  onClose,
  title,
  children
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles['epunchModal-backdrop']} onClick={handleBackdropClick}>
      <div className={styles['epunchModal-container']}>
        <header className={styles['epunchModal-header']}>
          {title && (
            <h2 className={styles['epunchModal-title']}>
              {title}
            </h2>
          )}
          <button
            className={styles['epunchModal-closeButton']}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </header>
        
        <div className={styles['epunchModal-content']}>
          {children}
        </div>
      </div>
    </div>
  );
}; 
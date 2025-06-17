import React from 'react';
import { PunchCardStyleDto } from 'e-punch-common-core';
import { EpunchConfirmOrCancelButtons } from '../../../../components/foundational';
import { PunchCardPreview } from '../PunchCardPreview';
import styles from './StylePreviewSection.module.css';

interface StylePreviewSectionProps {
  currentStyle: PunchCardStyleDto;
  updatedStyle?: PunchCardStyleDto | null;
  onApplyStyle: () => void;
  onReset: () => void;
  loading: boolean;
}

export const StylePreviewSection: React.FC<StylePreviewSectionProps> = ({
  currentStyle,
  updatedStyle,
  onApplyStyle,
  onReset,
  loading
}) => {
  return (
    <div className={styles.stylePreviewSection}>
      <h3 className={styles.previewTitle}>
        📱 {updatedStyle ? 'Current vs New Style' : 'Current Style'}
      </h3>
      
      <div 
        className={`${styles.previewGrid} ${updatedStyle ? styles.withComparison : ''}`}
      >
        <div className={styles.previewCardContainer}>
          <PunchCardPreview
            primaryColor={currentStyle.primaryColor || '#5d4037'}
            secondaryColor={currentStyle.secondaryColor || '#795548'}
            logoUrl={currentStyle.logoUrl}
            punchIcons={currentStyle.punchIcons}
            size="large"
          />
        </div>

        {updatedStyle && (
          <>
            <div className={styles.previewArrow}>
              →
            </div>
            <div className={styles.previewCardContainer}>
              <PunchCardPreview
                primaryColor={updatedStyle.primaryColor || '#5d4037'}
                secondaryColor={updatedStyle.secondaryColor || '#795548'}
                logoUrl={updatedStyle.logoUrl}
                punchIcons={updatedStyle.punchIcons}
                size="large"
              />
            </div>
          </>
        )}
      </div>

      {updatedStyle && (
        <div className={styles.applyActions}>
          <EpunchConfirmOrCancelButtons
            onCancel={onReset}
            onConfirm={onApplyStyle}
            cancelText="Reset"
            confirmText="Apply Style"
            confirmDisabled={loading}
            cancelDisabled={loading}
          />
        </div>
      )}
    </div>
  );
}; 
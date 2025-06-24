import React from 'react';
import { PunchCardStyleDto } from 'e-punch-common-core';
import { EpunchConfirmOrCancelButtons } from '../../../../components/foundational';
import { PunchCardPreview } from '../PunchCardPreview';
import styles from './StylePreviewSection.module.css';

interface PreviewOptions {
  currentPunches: number;
  totalPunches: number;
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  showAnimations: boolean;
}

interface StylePreviewSectionProps {
  currentStyle: PunchCardStyleDto;
  updatedStyle?: PunchCardStyleDto | null;
  onApplyStyle: () => void;
  onReset: () => void;
  loading: boolean;
  previewOptions: PreviewOptions;
  onPreviewOptionsChange: (options: PreviewOptions) => void;
}

export const StylePreviewSection: React.FC<StylePreviewSectionProps> = ({
  currentStyle,
  updatedStyle,
  onApplyStyle,
  onReset,
  loading,
  previewOptions,
  onPreviewOptionsChange
}) => {
  return (
    <div className={styles.stylePreviewSection}>
      <h3 className={styles.previewTitle}>
        📱 {updatedStyle ? 'Current vs New Style' : 'Current Style'}
      </h3>
      
      {/* Preview Controls */}
      <div className={styles.previewControls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Punches:
            <input 
              type="number" 
              value={previewOptions.currentPunches}
              onChange={(e) => onPreviewOptionsChange({
                ...previewOptions, 
                currentPunches: parseInt(e.target.value) || 0
              })}
              min="0" 
              max={previewOptions.totalPunches}
              className={styles.controlInput}
            />
            <span>/ {previewOptions.totalPunches}</span>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            Status:
            <select 
              value={previewOptions.status}
              onChange={(e) => onPreviewOptionsChange({
                ...previewOptions,
                status: e.target.value as any
              })}
              className={styles.controlSelect}
            >
              <option value="ACTIVE">Active</option>
              <option value="REWARD_READY">Reward Ready</option>
              <option value="REWARD_REDEEMED">Redeemed</option>
            </select>
          </label>
        </div>
        
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            <input 
              type="checkbox"
              checked={previewOptions.showAnimations}
              onChange={(e) => onPreviewOptionsChange({
                ...previewOptions,
                showAnimations: e.target.checked
              })}
              className={styles.controlCheckbox}
            />
            Show Animations
          </label>
        </div>
      </div>
      
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
            {...previewOptions}
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
                {...previewOptions}
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
            confirmText="Apply"
            confirmDisabled={loading}
            cancelDisabled={loading}
          />
        </div>
      )}
    </div>
  );
}; 
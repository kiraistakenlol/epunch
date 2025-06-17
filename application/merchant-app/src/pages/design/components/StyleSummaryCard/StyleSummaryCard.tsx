import React from 'react';
import { PunchCardStyleDto } from 'e-punch-common-core';
import { EpunchCard, EpunchButon } from '../../../../components/foundational';
import { Edit, Save, Refresh, Palette, Image, Category } from '@mui/icons-material';
import { ColorPreview } from './ColorPreview';
import { LogoPreview } from './LogoPreview';
import { IconsPreview } from './IconsPreview';
import styles from './StyleSummaryCard.module.css';

interface StyleSummaryCardProps {
  style: PunchCardStyleDto;
  onEditColors: () => void;
  onEditLogo: () => void;
  onEditIcons: () => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export const StyleSummaryCard: React.FC<StyleSummaryCardProps> = ({
  style,
  onEditColors,
  onEditLogo,
  onEditIcons,
  hasUnsavedChanges,
  onSave,
  onReset,
  isSaving
}) => {
  return (
    <EpunchCard>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Punch Card Style</h2>
          {hasUnsavedChanges && (
            <span className={styles.unsavedBadge}>Unsaved Changes</span>
          )}
        </div>

        {/* Style Sections */}
        <div className={styles.sectionsGrid}>
          {/* Colors Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Palette className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Colors</h3>
            </div>
            <ColorPreview 
              primaryColor={style.primaryColor} 
              secondaryColor={style.secondaryColor} 
            />
            <EpunchButon onClick={onEditColors} className="btn-outline btn-block">
              <Edit style={{ marginRight: '8px' }} />
              Edit Colors
            </EpunchButon>
          </div>

          {/* Logo Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Image className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Logo</h3>
            </div>
            <LogoPreview logoUrl={style.logoUrl} />
            <EpunchButon onClick={onEditLogo} className="btn-outline btn-block">
              <Edit style={{ marginRight: '8px' }} />
              {style.logoUrl ? 'Change Logo' : 'Add Logo'}
            </EpunchButon>
          </div>

          {/* Icons Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Category className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Punch Icons</h3>
            </div>
            <IconsPreview punchIcons={style.punchIcons} />
            <EpunchButon onClick={onEditIcons} className="btn-outline btn-block">
              <Edit style={{ marginRight: '8px' }} />
              {style.punchIcons ? 'Change Icons' : 'Add Icons'}
            </EpunchButon>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <EpunchButon onClick={onReset} disabled={isSaving} className="btn-outline">
            <Refresh style={{ marginRight: '8px' }} />
            Reset to Defaults
          </EpunchButon>
          
          <EpunchButon 
            onClick={onSave} 
            disabled={!hasUnsavedChanges || isSaving}
            className="btn-primary"
          >
            <Save style={{ marginRight: '8px' }} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </EpunchButon>
        </div>
      </div>
    </EpunchCard>
  );
}; 
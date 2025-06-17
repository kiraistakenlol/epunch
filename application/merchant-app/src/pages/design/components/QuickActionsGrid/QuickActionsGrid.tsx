import React from 'react';
import SVG from 'react-inlinesvg';
import { PunchCardStyleDto } from 'e-punch-common-core';
import styles from './QuickActionsGrid.module.css';

interface QuickActionsGridProps {
  displayStyle: PunchCardStyleDto;
  onEditColors: () => void;
  onEditLogo: () => void;
  onEditIcons: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  displayStyle,
  onEditColors,
  onEditLogo,
  onEditIcons
}) => {
  const renderIconPreview = () => {
    if (displayStyle.punchIcons) {
      try {
        return (
          <>
            <div className={styles.iconSample}>
              <SVG 
                src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.filled.data.svg_raw_content)}`}
                width={24}
                height={24}
              />
            </div>
            <div className={styles.iconSample}>
              <SVG 
                src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.unfilled.data.svg_raw_content)}`}
                width={24}
                height={24}
              />
            </div>
          </>
        );
      } catch (error) {
        // Fall back to default circles
      }
    }
    
    return (
      <>
        <div className={styles.iconSample}>●</div>
        <div className={styles.iconSample}>○</div>
      </>
    );
  };

  return (
    <div className={styles.quickActionsGrid}>
      {/* Colors Action */}
      <div className={styles.actionCard} onClick={onEditColors}>
        <h4 className={styles.actionTitle}>Colors</h4>
        <div className={styles.colorsPreview}>
          <div 
            className={styles.colorSwatch}
            style={{ backgroundColor: displayStyle.primaryColor || '#5d4037' }}
          />
          <div 
            className={styles.colorSwatch}
            style={{ backgroundColor: displayStyle.secondaryColor || '#795548' }}
          />
        </div>
        <p className={styles.actionDescription}>
          Primary & Secondary
        </p>
      </div>

      {/* Logo Action */}
      <div className={styles.actionCard} onClick={onEditLogo}>
        <h4 className={styles.actionTitle}>Logo</h4>
        <div className={styles.logoContainer}>
          {displayStyle.logoUrl ? (
            <img 
              src={displayStyle.logoUrl} 
              alt="Logo" 
              className={styles.logoImage}
            />
          ) : (
            <div className={styles.logoPlaceholder}>
              +
            </div>
          )}
        </div>
        <p className={styles.actionDescription}>
          {displayStyle.logoUrl ? 'Change' : 'Add'}
        </p>
      </div>

      {/* Icons Action */}
      <div className={styles.actionCard} onClick={onEditIcons}>
        <h4 className={styles.actionTitle}>Icons</h4>
        <div className={styles.iconsPreview}>
          {renderIconPreview()}
        </div>
        <p className={styles.actionDescription}>
          {displayStyle.punchIcons ? 'Custom' : 'Default'}
        </p>
      </div>
    </div>
  );
}; 
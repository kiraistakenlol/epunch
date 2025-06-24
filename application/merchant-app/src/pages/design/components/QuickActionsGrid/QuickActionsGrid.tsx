import React from 'react';
import SVG from 'react-inlinesvg';
import { PunchCardStyleDto } from 'e-punch-common-core';
import { RemoveButton } from '../../../../components/foundational';
import styles from './QuickActionsGrid.module.css';

interface QuickActionsGridProps {
  displayStyle: PunchCardStyleDto;
  onEditColors: () => void;
  onEditLogo: () => void;
  onEditIcons: () => void;
  onRemoveCustomIcons: () => void;
  onRemoveColors?: () => void;
  onRemoveLogo?: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  displayStyle,
  onEditColors,
  onEditLogo,
  onEditIcons,
  onRemoveCustomIcons,
  onRemoveColors,
  onRemoveLogo
}) => {
  const renderIconPreview = () => {
    if (displayStyle.punchIcons) {
      try {
        return (
          <>
            <div className={styles.iconSample}>
              {displayStyle.punchIcons.filled ? (
                <SVG 
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.filled.data.svg_raw_content)}`}
                  width={24}
                  height={24}
                />
              ) : (
                '●'
              )}
            </div>
            <div className={styles.iconSample}>
              {displayStyle.punchIcons.unfilled ? (
                <SVG 
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(displayStyle.punchIcons.unfilled.data.svg_raw_content)}`}
                  width={24}
                  height={24}
                />
              ) : (
                '○'
              )}
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
      <div className={styles.actionCard} onClick={onEditColors} style={{ position: 'relative' }}>
        <h4 className={styles.actionTitle}>Colors</h4>
        <div className={styles.colorsPreview}>
          <div 
            className={styles.colorSwatch}
            style={{ 
              backgroundColor: displayStyle.primaryColor || '#f0f0f0',
              border: displayStyle.primaryColor ? 'none' : '2px dashed #ccc'
            }}
          >
            {!displayStyle.primaryColor && <span style={{ fontSize: '10px', color: '#999' }}>?</span>}
          </div>
          <div 
            className={styles.colorSwatch}
            style={{ 
              backgroundColor: displayStyle.secondaryColor || '#f0f0f0',
              border: displayStyle.secondaryColor ? 'none' : '2px dashed #ccc'
            }}
          >
            {!displayStyle.secondaryColor && <span style={{ fontSize: '10px', color: '#999' }}>?</span>}
          </div>
        </div>
        <p className={styles.actionDescription}>
          {(displayStyle.primaryColor || displayStyle.secondaryColor) ? 'Custom' : 'Unset'}
        </p>
        {(displayStyle.primaryColor || displayStyle.secondaryColor) && onRemoveColors && (
          <div onClick={(e) => e.stopPropagation()}>
            <RemoveButton
              onClick={onRemoveColors}
              title="Remove custom colors"
              top="8px"
              right="8px"
            />
          </div>
        )}
      </div>

      {/* Logo Action */}
      <div className={styles.actionCard} onClick={onEditLogo} style={{ position: 'relative' }}>
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
          {displayStyle.logoUrl ? 'Custom' : 'Unset'}
        </p>
        {displayStyle.logoUrl && onRemoveLogo && (
          <div onClick={(e) => e.stopPropagation()}>
            <RemoveButton
              onClick={onRemoveLogo}
              title="Remove logo"
              top="8px"
              right="8px"
            />
          </div>
        )}
      </div>

      {/* Icons Action */}
      <div className={styles.actionCard} onClick={onEditIcons} style={{ position: 'relative' }}>
        <h4 className={styles.actionTitle}>Icons</h4>
        <div className={styles.iconsPreview}>
          {renderIconPreview()}
        </div>
        <p className={styles.actionDescription}>
          {displayStyle.punchIcons ? 'Custom' : 'Unset'}
        </p>
        {displayStyle.punchIcons && (
          <div onClick={(e) => e.stopPropagation()}>
            <RemoveButton
              onClick={onRemoveCustomIcons}
              title="Remove custom icons"
              top="8px"
              right="8px"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 
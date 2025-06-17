import React from 'react';
import { Category } from '@mui/icons-material';
import { extractIconsFromPunchIcons, createDefaultPunchIcons } from '../../utils/iconTransform';
import styles from './IconsPreview.module.css';
import { PunchIconsDto } from 'e-punch-common-core';

interface IconsPreviewProps {
  punchIcons?: PunchIconsDto | null;
}

export const IconsPreview: React.FC<IconsPreviewProps> = ({ punchIcons }) => {
  // Extract icons or use defaults
  const icons = React.useMemo(() => {
    if (punchIcons) {
      try {
        return extractIconsFromPunchIcons(punchIcons);
      } catch {
        // If parsing fails, use defaults
      }
    }
    return extractIconsFromPunchIcons(createDefaultPunchIcons());
  }, [punchIcons]);

  const renderIcon = (svgContent: string, label: string) => {
    return (
      <div className={styles.iconSample}>
        <div 
          className={styles.iconContainer}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          title={label}
        />
        <span className={styles.iconLabel}>{label}</span>
      </div>
    );
  };

  return (
    <div className={styles.iconsPreview}>
      <div className={styles.iconsSamples}>
        {renderIcon(icons.filled.svg_content, 'Filled')}
        {renderIcon(icons.unfilled.svg_content, 'Unfilled')}
      </div>
      
      {/* Mini punch card preview with icons */}
      <div className={styles.miniCard}>
        <div className={styles.cardHeader}>
          <Category className={styles.cardIcon} />
          <span className={styles.cardTitle}>Punch Card</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.punchRow}>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={styles.punchSlot}
                dangerouslySetInnerHTML={{ 
                  __html: i < 3 ? icons.filled.svg_content : icons.unfilled.svg_content 
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {punchIcons && (
        <div className={styles.iconsInfo}>
          <span className={styles.iconsStatus}>✓ Custom icons selected</span>
        </div>
      )}
    </div>
  );
}; 
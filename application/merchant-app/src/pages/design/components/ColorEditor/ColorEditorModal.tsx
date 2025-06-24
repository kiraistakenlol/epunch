import React, { useState } from 'react';
import { EpunchModal, EpunchColorPicker, RemoveButton } from '../../../../components/foundational';
import styles from './ColorEditorModal.module.css';

interface ColorEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string | null;
  secondaryColor: string | null;
  onSave: (primaryColor: string | null, secondaryColor: string | null) => Promise<void>;
}

export const ColorEditorModal: React.FC<ColorEditorModalProps> = ({
  isOpen,
  onClose,
  primaryColor,
  secondaryColor,
  onSave
}) => {
  const [editingColor, setEditingColor] = useState<'primary' | 'secondary' | null>(null);
  
  React.useEffect(() => {
    if (!isOpen) {
      setEditingColor(null);
    }
  }, [isOpen]);

  const handleColorChange = (color: string) => {
    if (editingColor === 'primary') {
      onSave(color, secondaryColor);
    } else if (editingColor === 'secondary') {
      onSave(primaryColor, color);
    }
  };

  const handleResetColors = () => {
    onSave(null, null);
    setEditingColor(null);
  };

  const ColorArea = ({ 
    label, 
    color, 
    colorType 
  }: { 
    label: string; 
    color: string | null; 
    colorType: 'primary' | 'secondary';
  }) => (
    <div className={styles.colorArea}>
      <label className={styles.colorLabel}>{label}</label>
      {color ? (
        <div 
          className={styles.colorBox}
          style={{ backgroundColor: color }}
          onClick={() => setEditingColor(colorType)}
        >
          <span className={styles.colorValue}>{color}</span>
        </div>
      ) : (
        <div 
          className={styles.unsetColorBox}
          onClick={() => setEditingColor(colorType)}
        >
          Unset (click to set)
        </div>
      )}
    </div>
  );

  return (
    <EpunchModal
      open={isOpen}
      onClose={onClose}
      title="Edit Colors"
    >
      <div className={styles.colorEditor}>
        {editingColor ? (
          <div className={styles.colorPickerSection}>
            <div className={styles.colorPickerHeader}>
              <h3>Editing {editingColor} color</h3>
              <button 
                className={styles.backButton}
                onClick={() => setEditingColor(null)}
              >
                ← Back
              </button>
            </div>
            <EpunchColorPicker
              value={editingColor === 'primary' ? primaryColor || '#000000' : secondaryColor || '#000000'}
              onChange={handleColorChange}
              inline={true}
              showPresets={true}
            />
          </div>
        ) : (
          <div className={styles.colorAreas}>
            <div className={styles.colorAreasGrid}>
              <ColorArea 
                label="Primary" 
                color={primaryColor} 
                colorType="primary" 
              />
              <ColorArea 
                label="Secondary" 
                color={secondaryColor} 
                colorType="secondary" 
              />
            </div>
            
            {(primaryColor !== null || secondaryColor !== null) && (
              <RemoveButton
                onClick={handleResetColors}
                title="Remove custom colors"
                top="8px"
                right="8px"
              />
            )}
          </div>
        )}
      </div>
    </EpunchModal>
  );
}; 
import React, { useState } from 'react';
import { EpunchModal, EpunchColorPicker } from '../../../../components/foundational';

interface ColorEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  secondaryColor: string;
  onSave: (primaryColor: string, secondaryColor: string) => Promise<void>;
}

const DEFAULT_PRESETS = [
  { name: 'Coffee Brown', primary: '#5d4037', secondary: '#795548' },
  { name: 'Ocean Blue', primary: '#1976d2', secondary: '#42a5f5' },
  { name: 'Forest Green', primary: '#388e3c', secondary: '#66bb6a' },
  { name: 'Wine Red', primary: '#c62828', secondary: '#e57373' },
  { name: 'Royal Purple', primary: '#6a1b9a', secondary: '#ba68c8' },
  { name: 'Sunset Orange', primary: '#ef6c00', secondary: '#ff9800' },
];

export const ColorEditorModal: React.FC<ColorEditorModalProps> = ({
  isOpen,
  onClose,
  primaryColor,
  secondaryColor,
  onSave
}) => {
  const [localPrimaryColor, setLocalPrimaryColor] = useState(primaryColor);
  const [localSecondaryColor, setLocalSecondaryColor] = useState(secondaryColor);

  // Reset local state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalPrimaryColor(primaryColor);
      setLocalSecondaryColor(secondaryColor);
    }
  }, [isOpen, primaryColor, secondaryColor]);

  const handleClose = () => {
    // Save colors when modal closes (if they changed)
    if (localPrimaryColor !== primaryColor || localSecondaryColor !== secondaryColor) {
      onSave(localPrimaryColor, localSecondaryColor);
    }
    onClose();
  };

  const handlePresetSelect = (preset: typeof DEFAULT_PRESETS[0]) => {
    setLocalPrimaryColor(preset.primary);
    setLocalSecondaryColor(preset.secondary);
    // Save immediately when user selects a preset
    onSave(preset.primary, preset.secondary);
  };

  return (
    <EpunchModal
      open={isOpen}
      onClose={handleClose}
      title="Edit Colors"
    >
      <>
        {/* Color Pickers Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <EpunchColorPicker
            label="Primary Color"
            value={localPrimaryColor}
            onChange={setLocalPrimaryColor}
            showPresets={false}
          />
          
          <EpunchColorPicker
            label="Secondary Color"
            value={localSecondaryColor}
            onChange={setLocalSecondaryColor}
            showPresets={false}
          />
        </div>



        {/* Quick Presets - Horizontal */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#3e2723'
          }}>
            Quick Presets
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {DEFAULT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                title={preset.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5d4037';
                  e.currentTarget.style.backgroundColor = '#f8f8f8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: preset.primary,
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: preset.secondary,
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                </div>
                <span style={{ color: '#3e2723', fontSize: '10px' }}>
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>


      </>
    </EpunchModal>
  );
}; 
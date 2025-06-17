import React, { useState } from 'react';
import SVG from 'react-inlinesvg';
import { EpunchModal, EpunchColorPicker, EpunchButon } from '../../../../components/foundational';
import { Save, Cancel, Refresh } from '@mui/icons-material';

interface ColorEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor: string;
  secondaryColor: string;
  currentIcons?: string | null;
  onSave: (primaryColor: string, secondaryColor: string) => Promise<void>;
  isSaving: boolean;
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
  currentIcons,
  onSave,
  isSaving
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

  const handleSave = async () => {
    await onSave(localPrimaryColor, localSecondaryColor);
    if (!isSaving) {
      onClose();
    }
  };

  const handleCancel = () => {
    setLocalPrimaryColor(primaryColor);
    setLocalSecondaryColor(secondaryColor);
    onClose();
  };

  const handlePresetSelect = (preset: typeof DEFAULT_PRESETS[0]) => {
    setLocalPrimaryColor(preset.primary);
    setLocalSecondaryColor(preset.secondary);
  };

  const handleReset = () => {
    setLocalPrimaryColor('#5d4037');
    setLocalSecondaryColor('#795548');
  };

  const hasChanges = 
    localPrimaryColor !== primaryColor || 
    localSecondaryColor !== secondaryColor;

  return (
    <EpunchModal
      open={isOpen}
      onClose={handleCancel}
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

        {/* Live Preview - Compact */}
        <div style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#3e2723'
          }}>
            Preview
          </div>
          
          {/* Compact Card Preview */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            maxWidth: '200px',
            margin: '0 auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              backgroundColor: localPrimaryColor,
              color: 'white',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Loyalty Card
            </div>
            <div style={{ padding: '12px' }}>
                                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '4px',
                    marginBottom: '8px'
                  }}>
                    {[...Array(5)].map((_, i) => {
                      // Try to use current icons if available
                      if (currentIcons) {
                        try {
                          const parsed = JSON.parse(currentIcons);
                          const svgContent = i < 2 
                            ? parsed.filled.data.svg_raw_content 
                            : parsed.unfilled.data.svg_raw_content;
                                                     return (
                             <div
                               key={i}
                               style={{
                                 width: '16px',
                                 height: '16px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 color: localSecondaryColor
                               }}
                             >
                               <SVG 
                                 src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
                                 width={12}
                                 height={12}
                               />
                             </div>
                           );
                        } catch (error) {
                          // Fall back to default circles if parsing fails
                        }
                      }
                      
                      // Default circle icons
                      return (
                        <div
                          key={i}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: i < 2 ? localSecondaryColor : 'transparent',
                            border: `2px solid ${localSecondaryColor}`,
                            fontSize: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: i < 2 ? 'white' : localSecondaryColor,
                            fontWeight: 'bold'
                          }}
                        >
                          {i < 2 ? '✓' : ''}
                        </div>
                      );
                    })}
                  </div>
              <div style={{ fontSize: '9px', color: '#999' }}>
                2 / 5 punches
              </div>
            </div>
          </div>
          
          {/* Color Values - Inline */}
          <div style={{
            marginTop: '12px',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#666'
          }}>
            {localPrimaryColor} • {localSecondaryColor}
          </div>
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

        {/* Actions Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <EpunchButon onClick={handleReset} className="btn-outline">
            <Refresh style={{ marginRight: '8px' }} />
            Reset to Default
          </EpunchButon>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <EpunchButon onClick={handleCancel} disabled={isSaving} className="btn-outline">
              <Cancel style={{ marginRight: '8px' }} />
              Cancel
            </EpunchButon>
            
            <EpunchButon 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className="btn-primary"
            >
              <Save style={{ marginRight: '8px' }} />
              {isSaving ? 'Saving...' : 'Save Colors'}
            </EpunchButon>
          </div>
        </div>
      </>
    </EpunchModal>
  );
}; 
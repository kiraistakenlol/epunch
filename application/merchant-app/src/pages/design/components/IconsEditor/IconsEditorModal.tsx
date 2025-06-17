import React, { useState, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { toast } from 'react-toastify';
import { apiClient } from 'e-punch-common-ui';
import { PunchIconsDto, IconSearchResultDto, IconDto } from 'e-punch-common-core';
import { EpunchModal } from '../../../../components/foundational';

interface IconsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId: string;
  currentIcons?: string | null;
  onSave: (icons: PunchIconsDto) => Promise<void>;
  isSaving?: boolean;
}

export const IconsEditorModal: React.FC<IconsEditorModalProps> = ({
  isOpen,
  onClose,
  merchantId,
  currentIcons,
  onSave,
  isSaving = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableIcons, setAvailableIcons] = useState<IconDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilled, setSelectedFilled] = useState<IconDto | null>(null);
  const [selectedUnfilled, setSelectedUnfilled] = useState<IconDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load current icons if available
  useEffect(() => {
    if (currentIcons) {
      try {
        const parsed = JSON.parse(currentIcons) as PunchIconsDto;
        // Note: We can't easily reverse-lookup the original icons from SVG content
        // So we'll start with empty selection for now
      } catch (error) {
        console.error('Failed to parse current icons:', error);
      }
    }
  }, [currentIcons]);

  // Search for icons
  useEffect(() => {
    const searchIcons = async () => {
      setLoading(true);
      try {
        const result: IconSearchResultDto = await apiClient.searchIcons(
          searchQuery || undefined, 
          currentPage, 
          20
        );
        setAvailableIcons(result.icons);
      } catch (error) {
        console.error('Failed to search icons:', error);
        toast.error('Failed to load icons');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchIcons, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleIconSelect = (icon: IconDto, type: 'filled' | 'unfilled') => {
    if (type === 'filled') {
      setSelectedFilled(icon);
    } else {
      setSelectedUnfilled(icon);
    }
  };

  const handleSave = async () => {
    if (!selectedFilled || !selectedUnfilled) {
      toast.error('Please select both filled and unfilled icons');
      return;
    }

    try {
      const iconsData: PunchIconsDto = {
        filled: {
          type: 'svg',
          data: {
            svg_raw_content: selectedFilled.svg_content
          }
        },
        unfilled: {
          type: 'svg',
          data: {
            svg_raw_content: selectedUnfilled.svg_content
          }
        }
      };

      await onSave(iconsData);
      toast.success('Icons updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save icons:', error);
      toast.error('Failed to save icons');
    }
  };

  const renderIcon = (icon: IconDto, size = 40) => (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <SVG 
        src={`data:image/svg+xml;utf8,${encodeURIComponent(icon.svg_content)}`}
        width={size}
        height={size}
      />
    </div>
  );

  return (
    <EpunchModal
      open={isOpen}
      onClose={onClose}
      title="Icon Editor"
    >
      <>
        
        {/* Current Selection */}
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          border: '2px solid #e0e0e0'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#3e2723' }}>Selected Icons</h4>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '2px solid #d0d0d0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                marginBottom: '8px'
              }}>
                {selectedFilled ? renderIcon(selectedFilled, 40) : <span style={{ color: '#999' }}>?</span>}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Filled</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                border: '2px solid #d0d0d0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                marginBottom: '8px'
              }}>
                {selectedUnfilled ? renderIcon(selectedUnfilled, 40) : <span style={{ color: '#999' }}>?</span>}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Unfilled</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search icons (e.g., star, heart, coffee)..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d0d0d0',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Icons Grid */}
        <div style={{
          marginBottom: '24px',
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '16px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Loading icons...
            </div>
          ) : availableIcons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No icons found. Try a different search term.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '12px'
            }}>
              {availableIcons.map((icon) => (
                <div key={icon.id} style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => handleIconSelect(icon, 'filled')}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: selectedFilled?.id === icon.id ? '3px solid #4caf50' : '2px solid #d0d0d0',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px'
                    }}
                    title={`Select as filled: ${icon.name}`}
                  >
                    {renderIcon(icon, 30)}
                  </button>
                  <button
                    onClick={() => handleIconSelect(icon, 'unfilled')}
                    style={{
                      width: '60px',
                      height: '20px',
                      border: selectedUnfilled?.id === icon.id ? '2px solid #ff9800' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      backgroundColor: selectedUnfilled?.id === icon.id ? '#fff3e0' : 'white',
                      cursor: 'pointer',
                      fontSize: '10px',
                      color: '#666'
                    }}
                    title={`Select as unfilled: ${icon.name}`}
                  >
                    Unfilled
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Click icons to select as filled (green) or unfilled (orange)
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#5d4037',
                border: '2px solid #5d4037',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={!selectedFilled || !selectedUnfilled || isSaving}
              style={{
                padding: '10px 20px',
                backgroundColor: (selectedFilled && selectedUnfilled) ? '#5d4037' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (selectedFilled && selectedUnfilled) ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              {isSaving ? 'Saving...' : 'Save Icons'}
            </button>
          </div>
        </div>
      </>
    </EpunchModal>
  );
}; 
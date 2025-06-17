import React, { useState, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { apiClient } from 'e-punch-common-ui';
import { PunchIconsDto, IconSearchResultDto, IconDto } from 'e-punch-common-core';
import { EpunchModal } from '../../../../components/foundational';

interface IconsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcons?: PunchIconsDto | null;
  onSave: (icons: PunchIconsDto) => Promise<void>;
}

export const IconsEditorModal: React.FC<IconsEditorModalProps> = ({
  isOpen,
  onClose,
  currentIcons,
  onSave}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableIcons, setAvailableIcons] = useState<IconDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilled, setSelectedFilled] = useState<IconDto | null>(null);
  const [selectedUnfilled, setSelectedUnfilled] = useState<IconDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Load current icons if available
  useEffect(() => {
    if (currentIcons) {
      // Note: We can't easily reverse-lookup the original icons from SVG content
      // So we'll start with empty selection for now
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
    setOpenDropdown(null); // Close dropdown after selection
  };

  // Auto-save when both icons are selected
  React.useEffect(() => {
    if (selectedFilled && selectedUnfilled && isOpen) {
      const icons: PunchIconsDto = {
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
      onSave(icons);
    }
  }, [selectedFilled, selectedUnfilled, isOpen, onSave]);

  const handleIconClick = (iconId: string) => {
    setOpenDropdown(openDropdown === iconId ? null : iconId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);



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
              {availableIcons.map((icon) => {
                const isFilledSelected = selectedFilled?.id === icon.id;
                const isUnfilledSelected = selectedUnfilled?.id === icon.id;
                const isDropdownOpen = openDropdown === icon.id;
                
                return (
                  <div key={icon.id} style={{ textAlign: 'center', position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIconClick(icon.id);
                      }}
                      style={{
                        width: '60px',
                        height: '60px',
                        border: isFilledSelected ? '3px solid #4caf50' : isUnfilledSelected ? '3px solid #ff9800' : '2px solid #d0d0d0',
                        borderRadius: '8px',
                        backgroundColor: isFilledSelected ? '#e8f5e8' : isUnfilledSelected ? '#fff3e0' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                      title={`Click to select: ${icon.name}`}
                    >
                      {renderIcon(icon, 30)}
                      {(isFilledSelected || isUnfilledSelected) && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: isFilledSelected ? '#4caf50' : '#ff9800',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isFilledSelected ? '●' : '○'}
                        </div>
                      )}
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '65px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '100px'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconSelect(icon, 'filled');
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            backgroundColor: isFilledSelected ? '#e8f5e8' : 'transparent',
                            color: isFilledSelected ? '#4caf50' : '#333',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '6px 6px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            if (!isFilledSelected) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isFilledSelected) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span style={{ color: '#4caf50' }}>●</span>
                          Filled
                          {isFilledSelected && <span style={{ marginLeft: 'auto', color: '#4caf50' }}>✓</span>}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIconSelect(icon, 'unfilled');
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: 'none',
                            backgroundColor: isUnfilledSelected ? '#fff3e0' : 'transparent',
                            color: isUnfilledSelected ? '#ff9800' : '#333',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '0 0 6px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            if (!isUnfilledSelected) {
                              e.currentTarget.style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isUnfilledSelected) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span style={{ color: '#ff9800' }}>○</span>
                          Unfilled
                          {isUnfilledSelected && <span style={{ marginLeft: 'auto', color: '#ff9800' }}>✓</span>}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          textAlign: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          Click any icon to choose filled (●) or unfilled (○) type. Changes are applied automatically.
        </div>
      </>
    </EpunchModal>
  );
}; 
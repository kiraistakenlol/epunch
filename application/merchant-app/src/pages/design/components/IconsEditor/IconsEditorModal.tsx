import React, { useState, useEffect } from 'react';
import SVG from 'react-inlinesvg';
import { apiClient } from 'e-punch-common-ui';
import { PunchIconsDto, IconSearchResultDto, IconDto } from 'e-punch-common-core';
import { EpunchModal, RemoveButton } from '../../../../components/foundational';

interface IconsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIcons?: PunchIconsDto | null;
  onSave: (icons: PunchIconsDto | null) => Promise<void>;
}

export const IconsEditorModal: React.FC<IconsEditorModalProps> = ({
  isOpen,
  onClose,
  currentIcons,
  onSave}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableIcons, setAvailableIcons] = useState<IconDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilled, setSelectedFilled] = useState<IconDto | null>(null);
  const [selectedUnfilled, setSelectedUnfilled] = useState<IconDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSlot, setActiveSlot] = useState<'filled' | 'unfilled' | null>(null);

  // Load current icons if available
  useEffect(() => {
    if (currentIcons && isOpen) {
      // Try to find matching icons by searching for common terms and matching SVG content
      const searchForCurrentIcons = async () => {
        try {
          // Search for icons and try to match by SVG content
          const result: IconSearchResultDto = await apiClient.searchIcons(undefined, 1, 100);
          
          const filledSvg = currentIcons.filled?.data?.svg_raw_content;
          const unfilledSvg = currentIcons.unfilled?.data?.svg_raw_content;
          
          if (filledSvg) {
            const matchingFilled = result.icons.find(icon => 
              icon.svg_content.replace(/\s+/g, '') === filledSvg.replace(/\s+/g, '')
            );
            if (matchingFilled) {
              setSelectedFilled(matchingFilled);
            }
          }
          
          if (unfilledSvg) {
            const matchingUnfilled = result.icons.find(icon => 
              icon.svg_content.replace(/\s+/g, '') === unfilledSvg.replace(/\s+/g, '')
            );
            if (matchingUnfilled) {
              setSelectedUnfilled(matchingUnfilled);
            }
          }
        } catch (error) {
          console.error('Failed to load current icons:', error);
        }
      };
      
      searchForCurrentIcons();
    } else if (!currentIcons) {
      // Clear selections if no current icons
      setSelectedFilled(null);
      setSelectedUnfilled(null);
    }
  }, [currentIcons, isOpen]);

  // Search for icons
  useEffect(() => {
    const searchIcons = async () => {
      const isNewSearch = currentPage === 1;
      
      if (isNewSearch) {
        setLoading(true);
        setAvailableIcons([]);
      } else {
        setLoadingMore(true);
      }
      
      try {
        const result: IconSearchResultDto = await apiClient.searchIcons(
          searchQuery || undefined, 
          currentPage, 
          20
        );
        
        if (isNewSearch) {
          setAvailableIcons(result.icons);
        } else {
          setAvailableIcons(prev => [...prev, ...result.icons]);
        }
        
        setHasMore(result.icons.length === 20);
      } catch (error) {
        console.error('Failed to search icons:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    if (currentPage === 1) {
      const debounceTimer = setTimeout(searchIcons, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      searchIcons();
    }
  }, [searchQuery, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
  };

  const updateIcons = async (newFilled: IconDto | null, newUnfilled: IconDto | null) => {
    // If both icons are null, send null to clear all custom icons
    if (!newFilled && !newUnfilled) {
      await onSave(null);
      return;
    }

    // Create PunchIconsDto with individual nulls allowed
    const icons: PunchIconsDto = {
      filled: newFilled ? {
        type: 'svg',
        data: {
          svg_raw_content: newFilled.svg_content
        }
      } : null,
      unfilled: newUnfilled ? {
        type: 'svg',
        data: {
          svg_raw_content: newUnfilled.svg_content
        }
      } : null
    };

    await onSave(icons);
  };

  const handleIconSelect = async (icon: IconDto) => {
    if (!activeSlot) return;
    
    const newFilled = activeSlot === 'filled' ? icon : selectedFilled;
    const newUnfilled = activeSlot === 'unfilled' ? icon : selectedUnfilled;
    
    if (activeSlot === 'filled') {
      setSelectedFilled(icon);
    } else {
      setSelectedUnfilled(icon);
    }
    
    await updateIcons(newFilled, newUnfilled);
  };

  const handleRemoveIcon = async (type: 'filled' | 'unfilled') => {
    const newFilled = type === 'filled' ? null : selectedFilled;
    const newUnfilled = type === 'unfilled' ? null : selectedUnfilled;
    
    if (type === 'filled') {
      setSelectedFilled(null);
    } else {
      setSelectedUnfilled(null);
    }
    
    await updateIcons(newFilled, newUnfilled);
  };

  const handleSlotSelect = (slot: 'filled' | 'unfilled') => {
    setActiveSlot(activeSlot === slot ? null : slot);
  };

  // Handle scroll for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    if (isAtBottom && hasMore && !loading && !loadingMore) {
      setCurrentPage(prev => prev + 1);
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

  const renderCurrentIcon = (svg_content: string, size = 40) => (
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
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg_content)}`}
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
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#3e2723', fontSize: '14px', fontWeight: 'bold' }}>Custom Icons</h4>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', position: 'relative', minWidth: '70px' }}>
              <button
                onClick={() => handleSlotSelect('filled')}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: activeSlot === 'filled' ? '3px solid #4caf50' : '2px solid #d0d0d0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: activeSlot === 'filled' ? '#e8f5e8' : 'white',
                  marginBottom: '8px',
                  margin: '0 auto 8px auto',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Click to select filled slot"
              >
                {selectedFilled ? renderIcon(selectedFilled, 30) : 
                 currentIcons?.filled ? renderCurrentIcon(currentIcons.filled.data.svg_raw_content, 30) :
                 <span style={{ color: '#999', fontSize: '14px' }}>?</span>}
              </button>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                Filled {activeSlot === 'filled' && <span style={{ color: '#4caf50' }}>●</span>}
              </div>
              {(selectedFilled || currentIcons?.filled) && (
                <RemoveButton
                  onClick={() => handleRemoveIcon('filled')}
                  title="Remove filled icon"
                  right="calc(50% - 31px)"
                />
              )}
            </div>
            
            <div style={{ textAlign: 'center', position: 'relative', minWidth: '70px' }}>
              <button
                onClick={() => handleSlotSelect('unfilled')}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  border: activeSlot === 'unfilled' ? '3px solid #ff9800' : '2px solid #d0d0d0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: activeSlot === 'unfilled' ? '#fff3e0' : 'white',
                  marginBottom: '8px',
                  margin: '0 auto 8px auto',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Click to select unfilled slot"
              >
                {selectedUnfilled ? renderIcon(selectedUnfilled, 30) : 
                 currentIcons?.unfilled ? renderCurrentIcon(currentIcons.unfilled.data.svg_raw_content, 30) :
                 <span style={{ color: '#999', fontSize: '14px' }}>?</span>}
              </button>
              <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                Unfilled {activeSlot === 'unfilled' && <span style={{ color: '#ff9800' }}>●</span>}
              </div>
              {(selectedUnfilled || currentIcons?.unfilled) && (
                <RemoveButton
                  onClick={() => handleRemoveIcon('unfilled')}
                  title="Remove unfilled icon"
                  right="calc(50% - 31px)"
                />
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #d0d0d0',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Icons Grid */}
        <div 
          onScroll={handleScroll}
          style={{
            marginBottom: '16px',
            maxHeight: '220px',
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '8px'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '14px' }}>
              Loading icons...
            </div>
          ) : availableIcons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '14px' }}>
              No icons found. Try a different search term.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
              gap: '8px',
              justifyItems: 'center'
            }}>
              {availableIcons.map((icon) => {
                const isFilledSelected = selectedFilled?.id === icon.id;
                const isUnfilledSelected = selectedUnfilled?.id === icon.id;
                
                return (
                  <div key={icon.id} style={{ textAlign: 'center', position: 'relative', width: '100%' }}>
                    <button
                      onClick={() => handleIconSelect(icon)}
                      disabled={!activeSlot}
                      style={{
                        width: '50px',
                        height: '50px',
                        border: isFilledSelected ? '2px solid #4caf50' : isUnfilledSelected ? '2px solid #ff9800' : '1px solid #d0d0d0',
                        borderRadius: '6px',
                        backgroundColor: isFilledSelected ? '#e8f5e8' : isUnfilledSelected ? '#fff3e0' : 'white',
                        cursor: activeSlot ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        margin: '0 auto',
                        opacity: activeSlot ? 1 : 0.5
                      }}
                      title={activeSlot ? `Click to assign to ${activeSlot} slot` : 'Select a slot first'}
                    >
                      {renderIcon(icon, 24)}
                      {(isFilledSelected || isUnfilledSelected) && (
                        <div style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: isFilledSelected ? '#4caf50' : '#ff9800',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isFilledSelected ? '●' : '○'}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div style={{ textAlign: 'center', padding: '16px', color: '#666', fontSize: '14px' }}>
              Loading more icons...
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
          Select a slot above, then click an icon to assign it
        </div>
      </>
    </EpunchModal>
  );
}; 
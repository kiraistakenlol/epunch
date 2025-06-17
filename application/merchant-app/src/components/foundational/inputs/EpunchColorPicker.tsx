import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colors, spacing, borderRadius, shadows } from '../../../theme/constants';
import styles from './EpunchColorPicker.module.css';

export interface EpunchColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  presetColors?: string[];
  showPresets?: boolean;
}

export const EpunchColorPicker: React.FC<EpunchColorPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  fullWidth = true,
  presetColors = [
    colors.primary,
    colors.primaryDark,
    colors.secondary,
    colors.secondaryDark,
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff'
  ],
  showPresets = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top' | 'center'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputId = React.useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Position popover to avoid overflow on mobile
  useEffect(() => {
    if (isOpen && containerRef.current && popoverRef.current) {
      const updatePosition = () => {
        const container = containerRef.current;
        const popover = popoverRef.current;
        
        if (!container || !popover) return;

        const containerRect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // On mobile screens, use center positioning
        if (viewportWidth <= 480) {
          setPopoverPosition('center');
          return;
        }
        
        // On tablet screens, check if there's enough space below
        if (viewportWidth <= 768) {
          const spaceBelow = viewportHeight - containerRect.bottom;
          const spaceAbove = containerRect.top;
          
          if (spaceBelow < 300 && spaceAbove > spaceBelow) {
            setPopoverPosition('top');
          } else {
            setPopoverPosition('bottom');
          }
          return;
        }
        
        // Desktop - default bottom positioning
        setPopoverPosition('bottom');
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isOpen]);

  const handleColorSwatchClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div 
      className={styles.colorPickerContainer} 
      style={{ width: fullWidth ? '100%' : 'auto' }}
      ref={containerRef}
    >
      {label && (
        <label 
          htmlFor={inputId}
          className={`${styles.colorPickerLabel} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}
        >
          {label}
          {required && ' *'}
        </label>
      )}
      
      <div className={styles.colorInputWrapper}>
        <button
          type="button"
          id={inputId}
          className={`${styles.colorSwatch} ${disabled ? styles.disabled : ''}`}
          style={{ backgroundColor: value }}
          onClick={handleColorSwatchClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-label={`Selected color: ${value}`}
        >
          <span className={styles.colorValue}>{value}</span>
        </button>
        
        {isOpen && (
          <div 
            ref={popoverRef}
            className={`${styles.colorPickerPopover} ${styles[`position-${popoverPosition}`] || ''}`}
          >
            <div className={styles.colorPickerContent}>
              <HexColorPicker 
                color={value} 
                onChange={onChange}
                className={styles.hexColorPicker}
              />
              
              {showPresets && (
                <div className={styles.presetColorsSection}>
                  <div className={styles.presetColorsLabel}>Preset Colors</div>
                  <div className={styles.presetColorsGrid}>
                    {presetColors.map((presetColor) => (
                      <button
                        key={presetColor}
                        type="button"
                        className={`${styles.presetColorSwatch} ${value === presetColor ? styles.selected : ''}`}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handlePresetClick(presetColor)}
                        aria-label={`Preset color: ${presetColor}`}
                        title={presetColor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
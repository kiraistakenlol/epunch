import React, { useState, useEffect, useCallback } from 'react';
import { Search, Clear } from '@mui/icons-material';
import styles from './EpunchSearchInput.module.css';

export interface EpunchSearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
}

export const EpunchSearchInput: React.FC<EpunchSearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 300,
  disabled = false,
  fullWidth = true,
  autoFocus = false,
  showClearButton = true
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced change handler
  const debouncedOnChange = useCallback(
    (searchValue: string) => {
      if (onDebouncedChange) {
        onDebouncedChange(searchValue);
      }
    },
    [onDebouncedChange]
  );

  // Setup debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedOnChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [internalValue, debounceMs, debouncedOnChange]);

  // Sync external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    if (onDebouncedChange) {
      onDebouncedChange('');
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div 
      className={`${styles.searchContainer} ${fullWidth ? styles.fullWidth : ''}`}
    >
      <div className={`${styles.searchInputWrapper} ${isFocused ? styles.focused : ''} ${disabled ? styles.disabled : ''}`}>
        <Search className={styles.searchIcon} />
        
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        
        {showClearButton && internalValue && !disabled && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <Clear className={styles.clearIcon} />
          </button>
        )}
      </div>
    </div>
  );
}; 
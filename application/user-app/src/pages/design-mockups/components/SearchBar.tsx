import React from 'react';
import { SearchBarProps } from '../types';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar; 
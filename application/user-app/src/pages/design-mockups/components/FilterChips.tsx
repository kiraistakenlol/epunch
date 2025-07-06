import React from 'react';
import { FilterChipsProps } from '../types';
import './FilterChips.css';

const FilterChips: React.FC<FilterChipsProps> = ({ chips, activeChipId, onChipClick }) => {
  return (
    <div className="filter-chips">
      {chips.map((chip) => (
        <button
          key={chip.id}
          className={`filter-chip ${chip.id === activeChipId ? 'filter-chip--active' : ''}`}
          onClick={() => onChipClick?.(chip.id)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChips; 
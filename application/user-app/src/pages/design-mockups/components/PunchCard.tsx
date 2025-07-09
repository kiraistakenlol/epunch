import React from 'react';
import './PunchCard.css';

export interface PunchCardProps {
  totalSlots: number;
  punchedSlots: number;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'completed' | 'minimal';
}

const PunchCard: React.FC<PunchCardProps> = ({
  totalSlots = 10,
  punchedSlots = 0,
  title,
  subtitle,
  className = '',
  variant = 'default'
}) => {
  const slots = Array.from({ length: totalSlots }, (_, index) => ({
    id: index,
    isPunched: index < punchedSlots
  }));

  return (
    <div className={`punch-card punch-card--${variant} ${className}`}>
      {(title || subtitle) && (
        <div className="punch-card__header">
          {title && <div className="punch-card__title">{title}</div>}
          {subtitle && <div className="punch-card__subtitle">{subtitle}</div>}
        </div>
      )}
      
      <div className="punch-card__grid">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`punch-card__slot ${slot.isPunched ? 'punch-card__slot--punched' : ''}`}
          >
            {slot.isPunched && <div className="punch-card__punch" />}
          </div>
        ))}
      </div>
      
      {variant !== 'minimal' && (
        <div className="punch-card__footer">
          <span className="punch-card__progress">
            {punchedSlots}/{totalSlots}
          </span>
        </div>
      )}
    </div>
  );
};

export default PunchCard; 
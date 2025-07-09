import React from 'react';
import { ShopCard } from '../../../components';
import { ShopCardData } from '../../../types';
import './PunchCardCarousel.css';

interface PunchCardCarouselProps {
  cards: ShopCardData[];
  onCardClick?: (cardId: string) => void;
}

const PunchCardCarousel: React.FC<PunchCardCarouselProps> = ({ cards, onCardClick }) => {
  return (
    <div className="punch-card-carousel">
      <div className="carousel-container">
        {cards.map((card) => (
          <div key={card.id} className="carousel-card">
            <ShopCard 
              data={card}
              onClick={() => onCardClick?.(card.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PunchCardCarousel; 
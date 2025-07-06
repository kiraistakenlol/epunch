import React, { useState } from 'react';
import BaseScreen from './BaseScreen';
import { ShopCard } from '../../../components';
import { ScreenProps, ShopCardData } from '../../../types';
import SearchBar from '../../../components/SearchBar';
import FilterChips from '../../../components/FilterChips';
import './CardsScreen.css';

const CardsScreen: React.FC<ScreenProps> = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const allCards: ShopCardData[] = [
    {
      id: '1',
      name: 'Pottery Cafe',
      emoji: '☕',
      currentPunches: 10,
      totalPunches: 10,
      location: 'Downtown',
      status: 'reward_ready',
      motivationText: 'Reward Ready!'
    },
    {
      id: '2',
      name: 'Green Smoothie',
      emoji: '🥤',
      currentPunches: 5,
      totalPunches: 5,
      location: 'Mall',
      status: 'reward_ready',
      motivationText: 'Free smoothie awaits!'
    },
    {
      id: '3',
      name: 'Pizza Corner',
      emoji: '🍕',
      currentPunches: 7,
      totalPunches: 10,
      location: 'Main St',
      status: 'active',
      motivationText: '3 more for free pizza!'
    },
    {
      id: '4',
      name: 'Book Nook',
      emoji: '📚',
      currentPunches: 3,
      totalPunches: 8,
      location: 'Library Square',
      status: 'active',
      motivationText: '5 more for 20% off'
    },
    {
      id: '5',
      name: 'Gym Plus',
      emoji: '💪',
      currentPunches: 2,
      totalPunches: 12,
      location: 'Fitness Center',
      status: 'active',
      motivationText: '10 more for free session'
    },
    {
      id: '6',
      name: 'Hair Studio',
      emoji: '💇',
      currentPunches: 1,
      totalPunches: 6,
      location: 'Beauty District',
      status: 'active',
      motivationText: '5 more for free wash'
    }
  ];

  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'reward_ready', label: 'Rewards' },
    { id: 'active', label: 'Active' },
    { id: 'food', label: 'Food' },
    { id: 'fitness', label: 'Fitness' }
  ];

  const filteredCards = allCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesFilter = activeFilter === 'all' || card.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <BaseScreen
      headerTitle="My Cards"
      headerStats={`${allCards.length} cards`}
      activeNavItemId="cards"
    >
      <div className="cards-screen">
        <SearchBar
          placeholder="Search cards..."
          value={searchValue}
          onChange={setSearchValue}
        />
        
        <FilterChips
          chips={filterChips}
          activeChipId={activeFilter}
          onChipClick={setActiveFilter}
        />
        
        <div className="cards-list">
          {filteredCards.map((card) => (
            <ShopCard key={card.id} data={card} />
          ))}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CardsScreen; 
import React, { useState, useMemo } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, SearchBar, FilterChips, ShopCard, Button } from '../../../components';
import ContextualQRModal from '../components/ContextualQRModal';
import './CardsScreen.css';

const CardsScreen: React.FC<ScreenProps> = ({ isActive: _isActive }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);

  const mockCards = [
    {
      id: '1',
      name: 'Daily Grind Coffee',
      emoji: '☕',
      currentPunches: 6,
      totalPunches: 8,
      location: 'Downtown',
      status: 'active' as const,
      motivationText: '2 more for free coffee!'
    },
    {
      id: '2',
      name: 'Bella Vista Pizza',
      emoji: '🍕',
      currentPunches: 4,
      totalPunches: 6,
      location: 'Main Street',
      status: 'active' as const,
      motivationText: '2 more for free pizza!'
    },
    {
      id: '3',
      name: 'Green Smoothie Co',
      emoji: '🥤',
      currentPunches: 8,
      totalPunches: 8,
      location: 'Health District',
      status: 'reward_ready' as const,
      motivationText: 'Free smoothie ready!'
    },
    {
      id: '4',
      name: 'Book Corner Cafe',
      emoji: '📚',
      currentPunches: 3,
      totalPunches: 10,
      location: 'University Area',
      status: 'active' as const,
      motivationText: '7 more for free latte!'
    },
    {
      id: '5',
      name: 'Sunset Bakery',
      emoji: '🥐',
      currentPunches: 5,
      totalPunches: 7,
      location: 'Sunset Boulevard',
      status: 'active' as const,
      motivationText: '2 more for free pastry!'
    }
  ];

  const filterChips = [
    { id: 'all', label: 'All Cards' },
    { id: 'active', label: 'Active' },
    { id: 'reward_ready', label: 'Ready' },
    { id: 'recent', label: 'Recent' }
  ];

  const filteredCards = useMemo(() => {
    let filtered = mockCards;

    if (searchValue) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        card.location?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(card => card.status === activeFilter);
    }

    return filtered;
  }, [searchValue, activeFilter]);

  const navItems = [
    { id: 'cards', icon: '💳', label: 'Cards' },
    { id: 'rewards', icon: '🎁', label: 'Rewards' },
    { id: 'activity', icon: '📊', label: 'Activity' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  const handleCardClick = (cardId: string) => {
    const card = mockCards.find(c => c.id === cardId);
    if (card?.status === 'reward_ready') {
      setShowQRModal(true);
    }
  };

  const qrButton = (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => setShowQRModal(true)}
    >
      QR
    </Button>
  );

  return (
    <BaseScreen
      className="cards-screen"
      headerProps={{
        title: "My Cards",
        rightElement: qrButton,
        stats: `${mockCards.length} cards`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: "cards"
      }}
    >
      <div className="cards-content">
        <div className="search-filter-section">
          <SearchBar 
            placeholder="Search shops..."
            value={searchValue}
            onChange={setSearchValue}
          />
          <FilterChips 
            chips={filterChips}
            activeChipId={activeFilter}
            onChipClick={setActiveFilter}
          />
        </div>

        <div className="cards-wallet">
          <div className="cards-grid">
            {filteredCards.map((card) => (
              <ShopCard 
                key={card.id}
                data={card}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {showQRModal && (
        <ContextualQRModal 
          onClose={() => setShowQRModal(false)}
          mode="user"
        />
      )}
    </BaseScreen>
  );
};

export default CardsScreen; 
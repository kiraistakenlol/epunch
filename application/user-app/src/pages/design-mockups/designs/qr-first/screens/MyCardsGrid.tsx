import React, { useState, useMemo } from 'react';
import { ScreenProps } from '../../../types';
import { BaseScreen, SearchBar, FilterChips, ShopCard } from '../../../components';
import { Wallet, History, User, Search } from 'lucide-react';
import FloatingQRButton from '../components/FloatingQRButton';
import QRCodeModal from '../components/QRCodeModal';
import './MyCardsGrid.css';

const MyCardsGrid: React.FC<ScreenProps> = ({ isActive }) => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);

  const mockCards = [
    {
      id: '1',
      name: 'Daily Grind Coffee',
      emoji: 'DG',
      currentPunches: 6,
      totalPunches: 8,
      location: 'Downtown',
      status: 'active' as const,
      motivationText: '2 more for free coffee!'
    },
    {
      id: '2',
      name: 'Bella Vista Pizza',
      emoji: 'BV',
      currentPunches: 4,
      totalPunches: 6,
      location: 'Main Street',
      status: 'active' as const,
      motivationText: '2 more for free pizza!'
    },
    {
      id: '3',
      name: 'Green Smoothie Co',
      emoji: 'GS',
      currentPunches: 8,
      totalPunches: 8,
      location: 'Health District',
      status: 'reward_ready' as const,
      motivationText: 'Free smoothie ready!'
    },
    {
      id: '4',
      name: 'Book Corner Cafe',
      emoji: 'BC',
      currentPunches: 3,
      totalPunches: 10,
      location: 'University Area',
      status: 'active' as const,
      motivationText: '7 more for free latte!'
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
    { id: 'wallet', icon: 'wallet', label: 'Wallet' },
    { id: 'history', icon: 'history', label: 'History' },
    { id: 'account', icon: 'user', label: 'Account' }
  ];

  const rewardsReady = mockCards.filter(card => card.status === 'reward_ready').length;

  return (
    <BaseScreen
      headerProps={{
        title: "Wallet",
        stats: `${mockCards.length} cards • ${rewardsReady} rewards ready`
      }}
      bottomNavProps={{
        items: navItems,
        activeItemId: 'wallet'
      }}
      className="my-cards-grid"
    >
      <div className="search-filter-section">
        <div className="search-input-container">
          <Search size={16} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>
        <FilterChips 
          chips={filterChips}
          activeChipId={activeFilter}
          onChipClick={setActiveFilter}
        />
      </div>

      <div className="cards-grid scrollable-content">
        {filteredCards.map((card) => (
          <ShopCard 
            key={card.id}
            data={card}
            onClick={() => {}}
          />
        ))}
      </div>

      <FloatingQRButton 
        onClick={() => setShowQRModal(true)}
        hasRewards={rewardsReady > 0}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        mode="user"
        hasRewards={rewardsReady > 0}
      />
    </BaseScreen>
  );
};

export default MyCardsGrid; 
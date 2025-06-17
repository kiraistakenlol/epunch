import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loyaltyProgramsReducer from '../features/loyaltyPrograms/loyaltyProgramsSlice';
import animationReducer from '../features/animations/animationSlice';
import PunchCardItem from '../features/dashboard/punch-cards/punch-card/PunchCardItem';
import type { LoyaltyProgramDto, PunchIconsDto } from 'e-punch-common-core';
import styles from './PunchCardPreviewWrapper.module.css';

// Create minimal store with only required slices
const createPreviewStore = (mockLoyaltyProgram: LoyaltyProgramDto) => {
  return configureStore({
    reducer: {
      loyaltyPrograms: loyaltyProgramsReducer,
      animations: animationReducer,
    },
    preloadedState: {
      loyaltyPrograms: {
        programs: {
          [mockLoyaltyProgram.id]: mockLoyaltyProgram
        },
        loading: false,
        error: null
      },
      animations: {
        sequence: [],
        currentStepIndex: 0,
        isRunning: false,
      }
    }
  });
};

interface PunchCardPreviewWrapperProps {
  // All the styling from merchant-app
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  punchIcons?: PunchIconsDto;
  merchantName: string;
  
  // Preview options
  currentPunches?: number;
  totalPunches?: number;
  status?: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  showAnimations?: boolean;
}

export const PunchCardPreviewWrapper: React.FC<PunchCardPreviewWrapperProps> = ({
  primaryColor,
  secondaryColor,
  logoUrl,
  punchIcons,
  merchantName,
  currentPunches = 3,
  totalPunches = 10,
  status = 'ACTIVE',
  showAnimations = false
}) => {
  // Create mock loyalty program
  const mockLoyaltyProgram: LoyaltyProgramDto = {
    id: 'preview-loyalty-program',
    name: `${merchantName} Rewards`,
    description: null,
    requiredPunches: totalPunches,
    rewardDescription: `${totalPunches}th coffee is free!`,
    isActive: true,
    merchant: {
      id: 'preview-merchant',
      name: merchantName,
      address: '123 Preview Street, Preview City',
      slug: 'preview-merchant',
      email: 'preview@merchant.com',
      logoUrl: logoUrl || '',
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  };

  // Create mock punch card
  const mockPunchCard = {
    id: 'preview-card',
    loyaltyProgramId: 'preview-loyalty-program',
    shopName: merchantName,
    shopAddress: '123 Preview Street, Preview City',
    currentPunches,
    totalPunches,
    status,
    styles: {
      primaryColor,
      secondaryColor,
      logoUrl: logoUrl || null,
      backgroundImageUrl: null,
      punchIcons: punchIcons || null
    },
    createdAt: new Date().toISOString()
  };

  // Create store with mock data
  const store = createPreviewStore(mockLoyaltyProgram);

  return (
    <Provider store={store}>
      <div 
        className={styles.previewContainer}
        style={{
          '--cards-section-height': '100vh',
          '--card-height': 'min(100vh, 100vw / 1.3)',
          '--card-width': 'min(100vw, 100vh * 1.3)'
        } as React.CSSProperties}
      >
        <PunchCardItem
          {...mockPunchCard}
          isHighlighted={showAnimations}
          animatedPunchIndex={showAnimations ? currentPunches - 1 : undefined}
        />
      </div>
    </Provider>
  );
}; 
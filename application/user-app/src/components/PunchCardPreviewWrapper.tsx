import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loyaltyProgramsReducer from '../features/loyaltyPrograms/loyaltyProgramsSlice';
import animationReducer from '../features/animations/animationSlice';
import PunchCardItem from '../features/dashboard/punch-cards/punch-card/PunchCardItem';
import { resolveCardStyles } from '../utils/cardStyles';
import type { LoyaltyProgramDto, PunchCardDto, PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core';
import styles from './PunchCardPreviewWrapper.module.css';

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
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  punchIcons?: PunchIconsDto;

  merchantName: string;
  loyaltyProgramName?: string;
  
  // Preview options
  currentPunches?: number;
  totalPunches?: number;
  status?: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  showAnimations?: boolean;
  hideShadow?: boolean;
  renderOnBackgroundColor?: string;
}

export const PunchCardPreviewWrapper: React.FC<PunchCardPreviewWrapperProps> = ({
  primaryColor,
  secondaryColor,
  logoUrl,
  punchIcons,
  merchantName,
  loyaltyProgramName,
  currentPunches = 3,
  totalPunches = 10,
  status = 'ACTIVE',
  showAnimations = false,
  hideShadow = false,
  renderOnBackgroundColor = 'white'
}) => {

  const mockLoyaltyProgram: LoyaltyProgramDto = {
    id: 'preview-loyalty-program',
    name: loyaltyProgramName || `${merchantName} Rewards`,
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
  } as LoyaltyProgramDto;

  const mockCardStyles = {
    primaryColor,
    secondaryColor,
    logoUrl: logoUrl || null,
    backgroundImageUrl: null,
    punchIcons: punchIcons || null
  } as PunchCardStyleDto;

  const resolvedStyles = resolveCardStyles(mockCardStyles);

  const mockPunchCard = {
    id: 'preview-card',
    loyaltyProgramId: 'preview-loyalty-program',
    shopName: merchantName,
    shopAddress: '123 Preview Street, Preview City',
    currentPunches,
    totalPunches,
    status,
    styles: mockCardStyles,
    createdAt: new Date().toISOString()
  } as PunchCardDto;

  const store = createPreviewStore(mockLoyaltyProgram);

  return (
    <Provider store={store}>
      <div 
        className={styles.previewContainer}
        style={{ backgroundColor: renderOnBackgroundColor }}
      >
        <PunchCardItem
          {...mockPunchCard}
          resolvedStyles={resolvedStyles}
          isHighlighted={showAnimations}
          animatedPunchIndex={showAnimations ? currentPunches - 1 : undefined}
          hideShadow={hideShadow}
        />
      </div>
    </Provider>
  );
}; 
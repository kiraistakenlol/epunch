import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import animationReducer from '../features/animations/animationSlice';
import signOutReducer from '../features/signOut/signOutSlice';
import completionOverlayReducer from '../features/dashboard/overlay/completionOverlaySlice';
import alertReducer from '../features/alert/alertSlice';
import loyaltyProgramsReducer from '../features/loyaltyPrograms/loyaltyProgramsSlice';
import DashboardPage from '../features/dashboard/DashboardPage';
import CompletionOverlay from '../features/dashboard/overlay/CompletionOverlay';
import Alert from '../features/alert/Alert';
import type { PunchCardDto, LoyaltyProgramDto, MerchantDto } from 'e-punch-common-core';
import { resolveCardStyles } from '../utils/cardStyles';
import styles from './DashboardPreviewWrapper.module.css';

interface DashboardPreviewWrapperProps {
  merchantSlug?: string | null;
  cards?: PunchCardDto[];
  selectedCardId?: string;
  completionOverlayCardId?: string;
  authState?: 'authenticated' | 'unauthenticated' | 'loading';
  renderOnBackgroundColor?: string;
}

const createPreviewStore = (
  cards: PunchCardDto[],
  selectedCardId?: string,
  completionOverlayCardId?: string,
  authState: 'authenticated' | 'unauthenticated' | 'loading' = 'authenticated'
) => {
  // Create loyalty programs from cards
  const loyaltyPrograms: { [key: string]: LoyaltyProgramDto } = {};
  cards.forEach(card => {
    if (!loyaltyPrograms[card.loyaltyProgramId]) {
      loyaltyPrograms[card.loyaltyProgramId] = {
        id: card.loyaltyProgramId,
        name: `${card.shopName} Rewards`,
        description: null,
        requiredPunches: card.totalPunches,
        rewardDescription: `${card.totalPunches}th item is free!`,
        isActive: true,
        merchant: {
          id: `merchant-${card.loyaltyProgramId}`,
          name: card.shopName,
          address: card.shopAddress,
          slug: `${card.shopName.toLowerCase().replace(/\s+/g, '-')}`,
          email: `contact@${card.shopName.toLowerCase().replace(/\s+/g, '')}.com`,
          logoUrl: card.styles.logoUrl || '',
          createdAt: new Date().toISOString()
        } as MerchantDto,
        createdAt: new Date().toISOString()
      } as LoyaltyProgramDto;
    }
  });

  // Mock user ID
  const mockUserId = 'preview-user-123';

  return configureStore({
    reducer: {
      auth: authReducer,
      punchCards: punchCardsReducer,
      animations: animationReducer,
      signOut: signOutReducer,
      completionOverlay: completionOverlayReducer,
      alert: alertReducer,
      loyaltyPrograms: loyaltyProgramsReducer,
    },
    preloadedState: {
      auth: {
        userId: mockUserId,
        isAuthenticated: authState === 'authenticated',
        superAdmin: false,
        isLoading: authState === 'loading',
        error: null,
        cognitoUser: null
      },
      punchCards: {
        cards: cards,
        selectedCardId: selectedCardId || null,
        scrollTargetCardId: null,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
        initialized: true
      },
      loyaltyPrograms: {
        programs: loyaltyPrograms,
        loading: false,
        error: null
      },
      animations: {
        sequence: [],
        currentStepIndex: 0,
        isRunning: false,
      },
      signOut: {
        isModalOpen: false
      },
      completionOverlay: {
        isVisible: !!completionOverlayCardId,
        cardId: completionOverlayCardId || null
      },
      alert: {
        visible: false,
        content: null
      }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['animations/startSequence', 'animations/setWaitingForEvent'],
          ignoredPaths: ['animations.sequence', 'animations.pendingCleanupStep'],
        },
      }),
  });
};

const createDefaultCards = (merchantSlug: string): PunchCardDto[] => {
  return [
    {
      id: 'preview-card-1',
      loyaltyProgramId: 'preview-loyalty-1',
      shopName: 'Preview Coffee Shop',
      shopAddress: '123 Preview Street, Preview City',
      currentPunches: 3,
      totalPunches: 10,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#8B4513',
        secondaryColor: '#F4E4BC',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    } as PunchCardDto,
    {
      id: 'preview-card-2',
      loyaltyProgramId: 'preview-loyalty-2',
      shopName: 'Preview Bakery',
      shopAddress: '456 Preview Avenue, Preview City',
      currentPunches: 9,
      totalPunches: 10,
      status: 'REWARD_READY',
      createdAt: new Date().toISOString(),
      styles: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#FFE5E5',
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      }
    } as PunchCardDto
  ];
};

export const DashboardPreviewWrapper: React.FC<DashboardPreviewWrapperProps> = ({
  merchantSlug,
  cards,
  selectedCardId,
  completionOverlayCardId,
  authState = 'authenticated',
  renderOnBackgroundColor = 'white'
}) => {
  // Use provided cards or generate default ones
  const previewCards = cards || (merchantSlug ? createDefaultCards(merchantSlug) : []);
  
  // Resolve card styles for all cards
  const cardsWithResolvedStyles = previewCards.map(card => ({
    ...card,
    resolvedStyles: resolveCardStyles(card.styles)
  }));

  const store = createPreviewStore(
    cardsWithResolvedStyles, 
    selectedCardId, 
    completionOverlayCardId, 
    authState
  );

  return (
    <Provider store={store}>
      <div 
        className={styles.previewContainer}
        style={{ backgroundColor: renderOnBackgroundColor }}
      >
        <DashboardPage />
        <CompletionOverlay />
        <Alert />
      </div>
    </Provider>
  );
}; 
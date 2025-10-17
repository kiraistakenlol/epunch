import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import bundlesReducer from '../features/bundles/bundlesSlice';
import benefitCardsReducer from '../features/benefitCards/benefitCardsSlice';
import animationReducer from '../features/animations/animationSlice';
import signOutReducer from '../features/signOut/signOutSlice';
import completionOverlayReducer from '../features/dashboard/overlay/completionOverlaySlice';
import alertReducer from '../features/alert/alertSlice';
import loyaltyProgramsReducer from '../features/loyaltyPrograms/loyaltyProgramsSlice';
import DashboardPage from '../features/dashboard/DashboardPage';
import CompletionOverlay from '../features/dashboard/overlay/CompletionOverlay';
import Alert from '../features/alert/Alert';
import type { PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core';
import { resolveCardStyles } from '../utils/cardStyles';
import styles from './DashboardPreviewWrapper.module.css';

interface DashboardPreviewWrapperProps {
  merchantSlug?: string | null;
  cards?: PunchCardDto[];
  loyaltyPrograms: LoyaltyProgramDto[];
  selectedCardId?: string;
  completionOverlayCardId?: string;
  authState?: 'authenticated' | 'unauthenticated' | 'loading';
  renderOnBackgroundColor?: string;
}

const createPreviewStore = (
  cards: PunchCardDto[],
  loyaltyPrograms: LoyaltyProgramDto[],
  selectedCardId?: string,
  completionOverlayCardId?: string,
  authState: 'authenticated' | 'unauthenticated' | 'loading' = 'authenticated'
) => {
  const loyaltyProgramsMap: { [key: string]: LoyaltyProgramDto } = {};
  loyaltyPrograms.forEach(program => {
    loyaltyProgramsMap[program.id] = program;
  });

  cards.forEach(card => {
    if (!loyaltyProgramsMap[card.loyaltyProgramId]) {
      throw new Error(`Loyalty program with id ${card.loyaltyProgramId} not found for card ${card.id}`);
    }
  });

  const mockUserId = 'preview-user-123';

  return configureStore({
    reducer: {
      auth: authReducer,
      punchCards: punchCardsReducer,
      bundles: bundlesReducer,
      benefitCards: benefitCardsReducer,
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
        authToken: authState === 'authenticated' ? 'mock-preview-token' : null
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
        programs: loyaltyProgramsMap,
        loading: false,
        error: null
      },
      bundles: {
        bundles: [],
        selectedBundleId: null,
        scrollTargetBundleId: null,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
        initialized: true
      },
      benefitCards: {
        benefitCards: [],
        selectedBenefitCardId: null,
        scrollTargetBenefitCardId: null,
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
        initialized: true
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



export const DashboardPreviewWrapper: React.FC<DashboardPreviewWrapperProps> = ({
  cards,
  loyaltyPrograms,
  selectedCardId,
  completionOverlayCardId,
  authState = 'authenticated',
  renderOnBackgroundColor = 'white'
}) => {
  const previewCards = cards || [];

  const cardsWithResolvedStyles = previewCards.map(card => ({
    ...card,
    resolvedStyles: resolveCardStyles(card.styles)
  }));

  const store = createPreviewStore(
    cardsWithResolvedStyles,
    loyaltyPrograms,
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
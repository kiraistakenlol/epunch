import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import authModalReducer from '../features/auth/authModalSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import bundlesReducer from '../features/bundles/bundlesSlice';
import benefitCardsReducer from '../features/benefitCards/benefitCardsSlice';
import animationReducer from '../features/animations/animationSlice';
import signOutReducer from '../features/signOut/signOutSlice';
import completionOverlayReducer from '../features/dashboard/overlay/completionOverlaySlice';
import alertReducer from '../features/alert/alertSlice';
import loyaltyProgramsReducer from '../features/loyaltyPrograms/loyaltyProgramsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModal: authModalReducer,
    punchCards: punchCardsReducer,
    bundles: bundlesReducer,
    benefitCards: benefitCardsReducer,
    animations: animationReducer,
    signOut: signOutReducer,
    completionOverlay: completionOverlayReducer,
    alert: alertReducer,
    loyaltyPrograms: loyaltyProgramsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['animations/startSequence', 'animations/setWaitingForEvent'],
        ignoredPaths: ['animations.sequence', 'animations.pendingCleanupStep'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
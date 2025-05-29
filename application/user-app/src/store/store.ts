import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import animationReducer from '../features/animations/animationSlice';
import signOutReducer from '../features/signOut/signOutSlice';
import completionOverlayReducer from '../features/dashboard/completionOverlaySlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    punchCards: punchCardsReducer,
    animations: animationReducer,
    signOut: signOutReducer,
    completionOverlay: completionOverlayReducer,
    alert: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['animations/startSequence'],
        ignoredPaths: ['animations.sequence'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import merchantReducer from './merchantSlice';
import loyaltyProgramsReducer from './loyaltyProgramsSlice';
import bundleProgramsReducer from './bundleProgramsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    merchant: merchantReducer,
    loyaltyPrograms: loyaltyProgramsReducer,
    bundlePrograms: bundleProgramsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
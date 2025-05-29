import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import signOutReducer from '../features/signOut/signOutSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  punchCards: punchCardsReducer,
  signOut: signOutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 
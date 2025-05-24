import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  punchCards: punchCardsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import uiEventsReducer from '../features/ui/uiEventsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  punchCards: punchCardsReducer,
  uiEvents: uiEventsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import punchCardsReducer from '../features/punchCards/punchCardsSlice';
import bundlesReducer from '../features/bundles/bundlesSlice';
import animationReducer from '../features/animations/animationSlice';
import signOutReducer from '../features/signOut/signOutSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  punchCards: punchCardsReducer,
  bundles: bundlesReducer,
  animations: animationReducer,
  signOut: signOutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 
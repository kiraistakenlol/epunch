import { combineReducers } from '@reduxjs/toolkit';

// Add your reducers here
const rootReducer = combineReducers({
  // example: exampleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 
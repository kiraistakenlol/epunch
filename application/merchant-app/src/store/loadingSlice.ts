import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isGlobalLoading: boolean;
  loadingMessage?: string;
}

const initialState: LoadingState = {
  isGlobalLoading: false,
  loadingMessage: undefined,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    // Note: Global loading now handled at component level with individual loading states
  },
});

// No actions exported - loading handled at component level
export default loadingSlice.reducer; 
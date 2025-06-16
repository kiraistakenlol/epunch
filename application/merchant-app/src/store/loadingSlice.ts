import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setGlobalLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isGlobalLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },
    clearGlobalLoading: (state) => {
      state.isGlobalLoading = false;
      state.loadingMessage = undefined;
    },
  },
});

export const { setGlobalLoading, clearGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer; 
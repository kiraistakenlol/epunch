import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CompletionOverlayState {
  isVisible: boolean;
  cardId: string | null;
}

const initialState: CompletionOverlayState = {
  isVisible: false,
  cardId: null,
};

const completionOverlaySlice = createSlice({
  name: 'completionOverlay',
  initialState,
  reducers: {
    showOverlay: (state, action: PayloadAction<{
      cardId: string;
    }>) => {
      state.isVisible = true;
      state.cardId = action.payload.cardId;
    },
    
    hideOverlay: (state) => {
      state.isVisible = false;
      state.cardId = null;
    },
  }
});

export const {
  showOverlay,
  hideOverlay
} = completionOverlaySlice.actions;

export const selectCompletionOverlay = (state: { completionOverlay: CompletionOverlayState }) => state.completionOverlay;

export default completionOverlaySlice.reducer; 
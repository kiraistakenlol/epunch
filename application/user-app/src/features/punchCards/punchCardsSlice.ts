import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PunchCardDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface PunchCardsState {
  cards: PunchCardDto[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PunchCardsState = {
  cards: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const fetchPunchCards = createAsyncThunk<
  PunchCardDto[],
  string,
  { rejectValue: string }
>(
  'punchCards/fetchPunchCards',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await apiClient.getUserPunchCards(userId);
      if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Received unexpected data format for punch cards');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch punch cards');
    }
  }
);

const punchCardsSlice = createSlice({
  name: 'punchCards',
  initialState,
  reducers: {
    clearPunchCards: (state) => {
      state.cards = [];
      state.error = null;
      state.lastFetched = null;
    },
    updatePunchCard: (state, action: PayloadAction<PunchCardDto>) => {
      const index = state.cards.findIndex(
        card => card.shopName === action.payload.shopName
      );
      if (index !== -1) {
        state.cards[index] = action.payload;
      } else {
        state.cards.push(action.payload);
      }
    },
    addPunchCard: (state, action: PayloadAction<PunchCardDto>) => {
      const exists = state.cards.some(
        card => card.shopName === action.payload.shopName
      );
      if (!exists) {
        state.cards.push(action.payload);
      }
    },
    incrementPunch: (state, action: PayloadAction<{ shopName: string }>) => {
      const card = state.cards.find(
        card => card.shopName === action.payload.shopName
      );
      if (card && card.currentPunches < card.totalPunches) {
        card.currentPunches += 1;
        if (card.currentPunches >= card.totalPunches) {
          card.status = 'REWARD_READY';
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPunchCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPunchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPunchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch punch cards';
      });
  },
});

export const {
  clearPunchCards,
  updatePunchCard,
  addPunchCard,
  incrementPunch,
  clearError,
} = punchCardsSlice.actions;

export const selectPunchCards = (state: { punchCards: PunchCardsState }) => state.punchCards.cards;
export const selectPunchCardsLoading = (state: { punchCards: PunchCardsState }) => state.punchCards.isLoading;
export const selectPunchCardsError = (state: { punchCards: PunchCardsState }) => state.punchCards.error;
export const selectLastFetched = (state: { punchCards: PunchCardsState }) => state.punchCards.lastFetched;

export default punchCardsSlice.reducer; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PunchCardDto, PunchCardStatusDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface PunchCardWithAnimations extends PunchCardDto {
  animateNewPunch?: boolean;
  animateNewCard?: boolean;
}

export interface PunchCardsState {
  cards: PunchCardWithAnimations[] | undefined;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PunchCardsState = {
  cards: undefined,
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
      state.cards = undefined;
      state.error = null;
      state.lastFetched = null;
    },
    updatePunchCard: (state, action: PayloadAction<PunchCardDto>) => {
      if (!state.cards) {
        state.cards = [action.payload];
        return;
      }
      const index = state.cards.findIndex(
        card => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cards[index] = action.payload;
      } else {
        state.cards.push(action.payload);
      }
    },
    updatePunchCardById: (state, action: PayloadAction<{ id: string; updates: Partial<PunchCardWithAnimations> }>) => {
      if (!state.cards) return;
      const index = state.cards.findIndex(
        card => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cards[index] = { ...state.cards[index], ...action.payload.updates };
      }
    },
    addPunchCard: (state, action: PayloadAction<PunchCardDto>) => {
      if (!state.cards) {
        state.cards = [action.payload];
        return;
      }
      const exists = state.cards.some(
        card => card.id === action.payload.id
      );
      if (!exists) {
        state.cards.unshift(action.payload);
      }
    },
    incrementPunch: (state, action: PayloadAction<{ id: string }>) => {
      if (!state.cards) return;
      const card = state.cards.find(
        card => card.id === action.payload.id
      );
      if (card && card.currentPunches < card.totalPunches) {
        card.currentPunches += 1;
        if (card.currentPunches >= card.totalPunches) {
          card.status = 'REWARD_READY';
        }
      }
    },
    incrementPunchById: (state, action: PayloadAction<{ id: string; status: PunchCardStatusDto }>) => {
      if (!state.cards) return;
      const card = state.cards.find(
        card => card.id === action.payload.id
      );
      if (card) {
        card.currentPunches += 1;
        card.status = action.payload.status;
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
  updatePunchCardById,
  addPunchCard,
  incrementPunch,
  incrementPunchById,
  clearError,
} = punchCardsSlice.actions;

export const selectPunchCards = (state: { punchCards: PunchCardsState }) => state.punchCards.cards;
export const selectPunchCardsLoading = (state: { punchCards: PunchCardsState }) => state.punchCards.isLoading;
export const selectPunchCardsError = (state: { punchCards: PunchCardsState }) => state.punchCards.error;
export const selectLastFetched = (state: { punchCards: PunchCardsState }) => state.punchCards.lastFetched;

export default punchCardsSlice.reducer; 
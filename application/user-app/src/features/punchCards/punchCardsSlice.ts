import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PunchCardDto, PunchCardStatusDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface PunchCardState extends PunchCardDto {
  visible?: boolean;
  showLastFilledPunchAsNotFilled?: boolean;
  animationFlags?: {
    punchAnimation?: { punchIndex: number };
    highlighted?: boolean;
    slideAnimation?: boolean;
    rewardClaimedAnimation?: boolean;
  };
}

export interface PunchCardsState {
  cards: PunchCardState[] | undefined;
  selectedCardId: string | null;
  scrollTargetCardId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  initialized: boolean;
}

const initialState: PunchCardsState = {
  cards: undefined,
  selectedCardId: null,
  scrollTargetCardId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  initialized: false,
};

// Helper function to preload punch card logo
const preloadCardLogo = (card: PunchCardState | PunchCardDto) => {
  if (card.styles?.logoUrl) {
    const img = new Image();
    img.src = card.styles.logoUrl;
  }
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
      state.initialized = false;
    },
    updatePunchCard: (state, action: PayloadAction<PunchCardState>) => {
      if (!state.cards) {
        state.cards = [action.payload];
        preloadCardLogo(action.payload);
        return;
      }
      const index = state.cards.findIndex(
        card => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cards[index] = action.payload;
      } else {
        state.cards.unshift(action.payload);
        preloadCardLogo(action.payload);
      }
    },
    updatePunchCardById: (state, action: PayloadAction<{ id: string; updates: Partial<PunchCardState> }>) => {
      if (!state.cards) return;
      const index = state.cards.findIndex(
        card => card.id === action.payload.id
      );
      if (index !== -1) {
        state.cards[index] = { ...state.cards[index], ...action.payload.updates };
      }
    },
    addPunchCard: (state, action: PayloadAction<PunchCardState>) => {
      if (!state.cards) {
        state.cards = [action.payload];
        preloadCardLogo(action.payload);
        return;
      }
      const exists = state.cards.some(
        card => card.id === action.payload.id
      );
      if (!exists) {
        state.cards.unshift(action.payload);
        preloadCardLogo(action.payload);
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
    setSelectedCardId: (state, action: PayloadAction<string | null>) => {
      state.selectedCardId = action.payload;
    },
    clearSelectedCard: (state) => {
      state.selectedCardId = null;
    },
    scrollToCard: (state, action: PayloadAction<string>) => {
      state.scrollTargetCardId = action.payload;
    },
    clearScrollTarget: (state) => {
      state.scrollTargetCardId = null;
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
        state.initialized = true;
        
        // Preload all logo images
        action.payload.forEach(preloadCardLogo);
      })
      .addCase(fetchPunchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch punch cards';
        state.initialized = true;
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
  setSelectedCardId,
  clearSelectedCard,
  scrollToCard,
  clearScrollTarget,
} = punchCardsSlice.actions;

export const selectPunchCards = (state: { punchCards: PunchCardsState }) => state.punchCards.cards;
export const selectPunchCardsLoading = (state: { punchCards: PunchCardsState }) => state.punchCards.isLoading;
export const selectPunchCardsError = (state: { punchCards: PunchCardsState }) => state.punchCards.error;
export const selectLastFetched = (state: { punchCards: PunchCardsState }) => state.punchCards.lastFetched;
export const selectSelectedCardId = (state: { punchCards: PunchCardsState }) => state.punchCards.selectedCardId;
export const selectScrollTargetCardId = (state: { punchCards: PunchCardsState }) => state.punchCards.scrollTargetCardId;
export const selectSelectedCard = (state: { punchCards: PunchCardsState }) => {
  const cards = state.punchCards.cards;
  const selectedId = state.punchCards.selectedCardId;
  return cards?.find(card => card.id === selectedId) || null;
};

export const selectPunchCardsInitialized = (state: { punchCards: PunchCardsState }) => state.punchCards.initialized;

export default punchCardsSlice.reducer; 
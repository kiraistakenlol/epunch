import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BenefitCardDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface BenefitCardState extends BenefitCardDto {
  animationFlags?: {
    highlighted?: boolean;
  };
}

export interface BenefitCardsState {
  benefitCards: BenefitCardState[] | undefined;
  selectedBenefitCardId: string | null;
  scrollTargetBenefitCardId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  initialized: boolean;
}

const initialState: BenefitCardsState = {
  benefitCards: undefined,
  selectedBenefitCardId: null,
  scrollTargetBenefitCardId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  initialized: false
};

export const fetchBenefitCards = createAsyncThunk(
  'benefitCards/fetchBenefitCards',
  async (userId: string, { rejectWithValue }) => {
    try {
      const benefitCards = await apiClient.getUserBenefitCards(userId);
      return benefitCards || [];
    } catch (error: any) {
      const statusCode = error.response?.status;
      return rejectWithValue({ 
        message: error.message || 'Failed to fetch benefit cards',
        statusCode 
      });
    }
  }
);

const benefitCardsSlice = createSlice({
  name: 'benefitCards',
  initialState,
  reducers: {
    clearBenefitCards: (state) => {
      state.benefitCards = undefined;
      state.error = null;
      state.lastFetched = null;
      state.initialized = false;
    },
    updateBenefitCard: (state, action: PayloadAction<BenefitCardState>) => {
      if (!state.benefitCards) {
        state.benefitCards = [action.payload];
        return;
      }
      const index = state.benefitCards.findIndex(
        benefitCard => benefitCard.id === action.payload.id
      );
      if (index !== -1) {
        state.benefitCards[index] = action.payload;
      } else {
        state.benefitCards.unshift(action.payload);
      }
    },
    addBenefitCard: (state, action: PayloadAction<BenefitCardState>) => {
      if (!state.benefitCards) {
        state.benefitCards = [action.payload];
        return;
      }
      const exists = state.benefitCards.some(
        benefitCard => benefitCard.id === action.payload.id
      );
      if (!exists) {
        state.benefitCards.unshift(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBenefitCardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBenefitCardId = action.payload;
    },
    clearSelectedBenefitCard: (state) => {
      state.selectedBenefitCardId = null;
    },
    scrollToBenefitCard: (state, action: PayloadAction<string>) => {
      state.scrollTargetBenefitCardId = action.payload;
    },
    clearScrollTarget: (state) => {
      state.scrollTargetBenefitCardId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenefitCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBenefitCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.benefitCards = action.payload;
        state.lastFetched = Date.now();
        state.initialized = true;
      })
      .addCase(fetchBenefitCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch benefit cards';
        state.initialized = true;
      });
  },
});

export const {
  clearBenefitCards,
  updateBenefitCard,
  addBenefitCard,
  clearError,
  setSelectedBenefitCardId,
  clearSelectedBenefitCard,
  scrollToBenefitCard,
  clearScrollTarget,
} = benefitCardsSlice.actions;

// Selectors
export const selectBenefitCards = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.benefitCards;
export const selectBenefitCardsLoading = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.isLoading;
export const selectBenefitCardsError = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.error;
export const selectBenefitCardsInitialized = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.initialized;
export const selectSelectedBenefitCardId = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.selectedBenefitCardId;
export const selectScrollTargetBenefitCardId = (state: { benefitCards: BenefitCardsState }) => state.benefitCards.scrollTargetBenefitCardId;

export const selectBenefitCardById = (state: { benefitCards: BenefitCardsState }, benefitCardId: string) =>
  state.benefitCards.benefitCards?.find((benefitCard: BenefitCardState) => benefitCard.id === benefitCardId);
export const selectSelectedBenefitCard = (state: { benefitCards: BenefitCardsState }) => {
  const selectedBenefitCardId = selectSelectedBenefitCardId(state);
  return selectedBenefitCardId ? selectBenefitCardById(state, selectedBenefitCardId) : null;
};

export default benefitCardsSlice.reducer;
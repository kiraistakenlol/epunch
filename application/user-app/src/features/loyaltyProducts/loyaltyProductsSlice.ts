import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PunchCardDto, BundleDto, LoyaltyProductsDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface PunchCardState extends PunchCardDto {
  animationFlags?: {
    highlighted?: boolean;
    punchAnimation?: { newPunchCount: number };
  };
}

export interface BundleState extends BundleDto {
  animationFlags?: {
    highlighted?: boolean;
    quantityAnimation?: { newQuantity: number };
  };
}

export interface LoyaltyProductsState {
  punchCards: PunchCardState[] | undefined;
  bundles: BundleState[] | undefined;
  selectedPunchCardId: string | null;
  selectedBundleId: string | null;
  scrollTargetCardId: string | null;
  scrollTargetBundleId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  initialized: boolean;
}

const initialState: LoyaltyProductsState = {
  punchCards: undefined,
  bundles: undefined,
  selectedPunchCardId: null,
  selectedBundleId: null,
  scrollTargetCardId: null,
  scrollTargetBundleId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  initialized: false
};

// Async thunk for fetching combined loyalty products
export const fetchLoyaltyProducts = createAsyncThunk(
  'loyaltyProducts/fetchLoyaltyProducts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await apiClient.getUserLoyaltyProducts(userId);
      return data;
    } catch (error: any) {
      const statusCode = error.response?.status;
      return rejectWithValue({ 
        message: error.message || 'Failed to fetch loyalty products',
        statusCode 
      });
    }
  }
);

const loyaltyProductsSlice = createSlice({
  name: 'loyaltyProducts',
  initialState,
  reducers: {
    clearLoyaltyProducts: (state) => {
      state.punchCards = undefined;
      state.bundles = undefined;
      state.error = null;
      state.lastFetched = null;
      state.initialized = false;
    },
    
    // Punch card actions
    updatePunchCard: (state, action: PayloadAction<PunchCardState>) => {
      if (!state.punchCards) {
        state.punchCards = [action.payload];
        return;
      }
      const index = state.punchCards.findIndex(
        card => card.id === action.payload.id
      );
      if (index !== -1) {
        state.punchCards[index] = action.payload;
      } else {
        state.punchCards.unshift(action.payload);
      }
    },
    
    addPunchCard: (state, action: PayloadAction<PunchCardState>) => {
      if (!state.punchCards) {
        state.punchCards = [action.payload];
        return;
      }
      const exists = state.punchCards.some(
        card => card.id === action.payload.id
      );
      if (!exists) {
        state.punchCards.unshift(action.payload);
      }
    },
    
    removePunchCard: (state, action: PayloadAction<string>) => {
      if (state.punchCards) {
        state.punchCards = state.punchCards.filter(
          card => card.id !== action.payload
        );
      }
    },
    
    // Bundle actions  
    updateBundle: (state, action: PayloadAction<BundleState>) => {
      if (!state.bundles) {
        state.bundles = [action.payload];
        return;
      }
      const index = state.bundles.findIndex(
        bundle => bundle.id === action.payload.id
      );
      if (index !== -1) {
        state.bundles[index] = action.payload;
      } else {
        state.bundles.unshift(action.payload);
      }
    },
    
    updateBundleById: (state, action: PayloadAction<{ id: string; updates: Partial<BundleState> }>) => {
      if (!state.bundles) return;
      const index = state.bundles.findIndex(
        bundle => bundle.id === action.payload.id
      );
      if (index !== -1) {
        state.bundles[index] = { ...state.bundles[index], ...action.payload.updates };
      }
    },
    
    addBundle: (state, action: PayloadAction<BundleState>) => {
      if (!state.bundles) {
        state.bundles = [action.payload];
        return;
      }
      const exists = state.bundles.some(
        bundle => bundle.id === action.payload.id
      );
      if (!exists) {
        state.bundles.unshift(action.payload);
      }
    },
    
    useBundleQuantity: (state, action: PayloadAction<{ id: string; quantityUsed: number }>) => {
      if (!state.bundles) return;
      const bundle = state.bundles.find(
        bundle => bundle.id === action.payload.id
      );
      if (bundle && bundle.remainingQuantity >= action.payload.quantityUsed) {
        bundle.remainingQuantity -= action.payload.quantityUsed;
        bundle.lastUsedAt = new Date().toISOString();
      }
    },
    
    // Selection actions
    setSelectedPunchCardId: (state, action: PayloadAction<string | null>) => {
      state.selectedPunchCardId = action.payload;
    },
    
    setSelectedBundleId: (state, action: PayloadAction<string | null>) => {
      state.selectedBundleId = action.payload;
    },
    
    clearSelectedPunchCard: (state) => {
      state.selectedPunchCardId = null;
    },
    
    clearSelectedBundle: (state) => {
      state.selectedBundleId = null;
    },
    
    // Scroll actions
    scrollToPunchCard: (state, action: PayloadAction<string>) => {
      state.scrollTargetCardId = action.payload;
    },
    
    scrollToBundle: (state, action: PayloadAction<string>) => {
      state.scrollTargetBundleId = action.payload;
    },
    
    clearScrollTargets: (state) => {
      state.scrollTargetCardId = null;
      state.scrollTargetBundleId = null;
    },
    
    // Animation actions
    clearPunchCardAnimationFlags: (state, action: PayloadAction<string>) => {
      if (!state.punchCards) return;
      const card = state.punchCards.find(
        card => card.id === action.payload
      );
      if (card) {
        delete card.animationFlags;
      }
    },
    
    clearBundleAnimationFlags: (state, action: PayloadAction<string>) => {
      if (!state.bundles) return;
      const bundle = state.bundles.find(
        bundle => bundle.id === action.payload
      );
      if (bundle) {
        delete bundle.animationFlags;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.punchCards = action.payload.punchCards;
        state.bundles = action.payload.bundles;
        state.lastFetched = Date.now();
        state.initialized = true;
      })
      .addCase(fetchLoyaltyProducts.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; statusCode?: number };
        // Don't show 401 errors as user-facing errors (authentication issues)
        if (payload?.statusCode !== 401) {
          state.error = payload?.message || 'Failed to fetch loyalty products';
        }
        state.punchCards = [];
        state.bundles = [];
        state.initialized = true;
      });
  },
});

export const {
  clearLoyaltyProducts,
  updatePunchCard,
  addPunchCard,
  removePunchCard,
  updateBundle,
  updateBundleById,
  addBundle,
  useBundleQuantity,
  setSelectedPunchCardId,
  setSelectedBundleId,
  clearSelectedPunchCard,
  clearSelectedBundle,
  scrollToPunchCard,
  scrollToBundle,
  clearScrollTargets,
  clearPunchCardAnimationFlags,
  clearBundleAnimationFlags,
  clearError,
} = loyaltyProductsSlice.actions;

// Selectors
export const selectPunchCards = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.punchCards;
export const selectBundles = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.bundles;
export const selectLoyaltyProductsLoading = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.isLoading;
export const selectLoyaltyProductsError = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.error;
export const selectLoyaltyProductsInitialized = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.initialized;
export const selectSelectedPunchCardId = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.selectedPunchCardId;
export const selectSelectedBundleId = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.selectedBundleId;
export const selectScrollTargetCardId = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.scrollTargetCardId;
export const selectScrollTargetBundleId = (state: { loyaltyProducts: LoyaltyProductsState }) => state.loyaltyProducts.scrollTargetBundleId;

export const selectPunchCardById = (state: { loyaltyProducts: LoyaltyProductsState }, cardId: string) => 
  state.loyaltyProducts.punchCards?.find((card: PunchCardState) => card.id === cardId);

export const selectBundleById = (state: { loyaltyProducts: LoyaltyProductsState }, bundleId: string) => 
  state.loyaltyProducts.bundles?.find((bundle: BundleState) => bundle.id === bundleId);

export const selectSelectedPunchCard = (state: { loyaltyProducts: LoyaltyProductsState }) => {
  const selectedCardId = selectSelectedPunchCardId(state);
  return selectedCardId ? selectPunchCardById(state, selectedCardId) : null;
};

export const selectSelectedBundle = (state: { loyaltyProducts: LoyaltyProductsState }) => {
  const selectedBundleId = selectSelectedBundleId(state);
  return selectedBundleId ? selectBundleById(state, selectedBundleId) : null;
};

export default loyaltyProductsSlice.reducer;
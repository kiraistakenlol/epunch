import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BundleDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface BundleState extends BundleDto {
  animationFlags?: {
    highlighted?: boolean;
    quantityAnimation?: { newQuantity: number };
  };
}

export interface BundlesState {
  bundles: BundleState[] | undefined;
  selectedBundleId: string | null;
  scrollTargetBundleId: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  initialized: boolean;
}

const initialState: BundlesState = {
  bundles: undefined,
  selectedBundleId: null,
  scrollTargetBundleId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  initialized: false
};

// Async thunk for fetching bundles
export const fetchBundles = createAsyncThunk(
  'bundles/fetchBundles',
  async (userId: string, { rejectWithValue }) => {
    try {
      const bundles = await apiClient.getUserBundles(userId);
      return bundles || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch bundles');
    }
  }
);

const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    clearBundles: (state) => {
      state.bundles = undefined;
      state.error = null;
      state.lastFetched = null;
      state.initialized = false;
    },
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
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBundleId: (state, action: PayloadAction<string | null>) => {
      state.selectedBundleId = action.payload;
    },
    clearSelectedBundle: (state) => {
      state.selectedBundleId = null;
    },
    scrollToBundle: (state, action: PayloadAction<string>) => {
      state.scrollTargetBundleId = action.payload;
    },
    clearScrollTarget: (state) => {
      state.scrollTargetBundleId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBundles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBundles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bundles = action.payload;
        state.lastFetched = Date.now();
        state.initialized = true;
      })
      .addCase(fetchBundles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch bundles';
        state.initialized = true;
      });
  },
});

export const {
  clearBundles,
  updateBundle,
  updateBundleById,
  addBundle,
  useBundleQuantity,
  clearError,
  setSelectedBundleId,
  clearSelectedBundle,
  scrollToBundle,
  clearScrollTarget,
} = bundlesSlice.actions;

// Selectors
export const selectBundles = (state: { bundles: BundlesState }) => state.bundles.bundles;
export const selectBundlesLoading = (state: { bundles: BundlesState }) => state.bundles.isLoading;
export const selectBundlesError = (state: { bundles: BundlesState }) => state.bundles.error;
export const selectSelectedBundleId = (state: { bundles: BundlesState }) => state.bundles.selectedBundleId;
export const selectScrollTargetBundleId = (state: { bundles: BundlesState }) => state.bundles.scrollTargetBundleId;
export const selectBundleById = (state: { bundles: BundlesState }, bundleId: string) => 
  state.bundles.bundles?.find((bundle: BundleState) => bundle.id === bundleId);
export const selectSelectedBundle = (state: { bundles: BundlesState }) => {
  const selectedBundleId = selectSelectedBundleId(state);
  return selectedBundleId ? selectBundleById(state, selectedBundleId) : null;
};

export default bundlesSlice.reducer; 
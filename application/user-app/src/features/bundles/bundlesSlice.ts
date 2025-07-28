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

// Mock data for development
const mockBundles = [
  {
    id: 'bundle-1',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-1',
      name: 'Gym Membership Package',
      itemName: 'Gym Visit',
      description: 'Visit our premium gym facilities',
      merchantName: 'FitLife Gym'
    },
    originalQuantity: 10,
    remainingQuantity: 7,
    expiresAt: '2025-12-31T23:59:59Z', // Active - expires end of year
    createdAt: '2025-06-15T10:00:00Z',
    lastUsedAt: '2025-07-20T14:30:00Z'
  },
  {
    id: 'bundle-2',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-2',
      name: 'Coffee Package',
      itemName: 'Coffee',
      description: 'Premium artisanal coffee',
      merchantName: 'Bean There Coffee'
    },
    originalQuantity: 20,
    remainingQuantity: 15,
    expiresAt: '2025-10-15T23:59:59Z', // Active - expires in October
    createdAt: '2025-05-01T09:00:00Z',
    lastUsedAt: '2025-07-25T08:15:00Z'
  },
  {
    id: 'bundle-3',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-3',
      name: 'Spa Day Package',
      itemName: 'Spa Treatment',
      description: 'Relaxing spa treatments',
      merchantName: 'Serenity Spa'
    },
    originalQuantity: 5,
    remainingQuantity: 0,
    expiresAt: '2025-09-30T23:59:59Z', // Used up but not expired
    createdAt: '2025-04-01T11:00:00Z',
    lastUsedAt: '2025-07-10T16:45:00Z'
  },
  {
    id: 'bundle-4',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-4',
      name: 'Pizza Night Deal',
      itemName: 'Pizza',
      description: 'Delicious wood-fired pizza',
      merchantName: 'Tony\'s Pizzeria'
    },
    originalQuantity: 8,
    remainingQuantity: 2,
    expiresAt: '2025-07-25T23:59:59Z', // Expired recently (3 days ago)
    createdAt: '2025-04-15T18:00:00Z',
    lastUsedAt: '2025-07-15T19:30:00Z'
  },
  {
    id: 'bundle-5',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-5',
      name: 'Smoothie Pack',
      itemName: 'Smoothie',
      description: null, // No description to test fallback
      merchantName: 'Fresh Juice Bar'
    },
    originalQuantity: 12,
    remainingQuantity: 9,
    expiresAt: '2025-08-05T23:59:59Z', // Expires soon (in about a week)
    createdAt: '2025-06-01T12:00:00Z',
    lastUsedAt: '2025-07-22T10:15:00Z'
  },
  {
    id: 'bundle-6',
    userId: 'user-1',
    bundleProgram: {
      id: 'program-6',
      name: 'Yoga Class Bundle',
      itemName: 'Yoga Class',
      description: 'Peaceful yoga sessions for mind and body',
      merchantName: 'Zen Studio'
    },
    originalQuantity: 15,
    remainingQuantity: 12,
    expiresAt: '2026-01-31T23:59:59Z', // Long expiration - very active
    createdAt: '2025-06-10T07:00:00Z',
    lastUsedAt: '2025-07-23T18:00:00Z'
  }
];

// Async thunk for fetching bundles
export const fetchBundles = createAsyncThunk(
  'bundles/fetchBundles',
  async (userId: string, { rejectWithValue }) => {
    try {
      const bundles = await apiClient.getUserBundles(userId);
      
      // For development: use mock data if API returns empty array
      if (!bundles || bundles.length === 0) {
        console.warn('API returned empty bundles, using mock bundle data for development');
        return mockBundles;
      }
      
      return bundles;
    } catch (error) {
      // For development: return mock data when API fails
      console.warn('API call failed, using mock bundle data:', error);
      return mockBundles;
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
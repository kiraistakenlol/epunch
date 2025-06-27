import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MerchantDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

interface MerchantState {
  merchant: MerchantDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: MerchantState = {
  merchant: null,
  loading: false,
  error: null,
};

export const fetchMerchant = createAsyncThunk(
  'merchant/fetchMerchant',
  async (merchantId: string, { rejectWithValue }) => {
    try {
      const merchantData = await apiClient.getMerchantById(merchantId);
      return merchantData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch merchant data');
    }
  }
);

export const fetchMerchantBySlug = createAsyncThunk(
  'merchant/fetchMerchantBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const merchant = await apiClient.getMerchantBySlug(slug);
      return merchant;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch merchant data');
    }
  }
);

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    clearMerchant: (state) => {
      state.merchant = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchant.fulfilled, (state, action: PayloadAction<MerchantDto>) => {
        state.loading = false;
        state.merchant = action.payload;
        state.error = null;
      })
      .addCase(fetchMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMerchantBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchantBySlug.fulfilled, (state, action: PayloadAction<MerchantDto>) => {
        state.loading = false;
        state.merchant = action.payload;
        state.error = null;
      })
      .addCase(fetchMerchantBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMerchant, clearError } = merchantSlice.actions;
export default merchantSlice.reducer; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BundleProgramDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

interface BundleProgramsState {
  programs: BundleProgramDto[];
  loading: boolean;
  error: string | null;
}

const initialState: BundleProgramsState = {
  programs: [],
  loading: false,
  error: null,
};

export const fetchBundlePrograms = createAsyncThunk(
  'bundlePrograms/fetchBundlePrograms',
  async (merchantId: string, { rejectWithValue }) => {
    try {
      const programs = await apiClient.getMerchantBundlePrograms(merchantId);
      return programs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch bundle programs');
    }
  }
);

const bundleProgramsSlice = createSlice({
  name: 'bundlePrograms',
  initialState,
  reducers: {
    clearBundlePrograms: (state) => {
      state.programs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBundlePrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBundlePrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
        state.error = null;
      })
      .addCase(fetchBundlePrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBundlePrograms } = bundleProgramsSlice.actions;

// Selectors
export const selectBundlePrograms = (state: { bundlePrograms: BundleProgramsState }) => state.bundlePrograms.programs;
export const selectBundleProgramsLoading = (state: { bundlePrograms: BundleProgramsState }) => state.bundlePrograms.loading;
export const selectBundleProgramsError = (state: { bundlePrograms: BundleProgramsState }) => state.bundlePrograms.error;

// Helper selector to get a specific bundle program by ID
export const selectBundleProgramById = (state: { bundlePrograms: BundleProgramsState }, programId: string) => 
  state.bundlePrograms.programs.find(program => program.id === programId);

export default bundleProgramsSlice.reducer; 
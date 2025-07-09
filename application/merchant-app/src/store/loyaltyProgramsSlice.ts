import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

interface LoyaltyProgramsState {
  programs: LoyaltyProgramDto[];
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyProgramsState = {
  programs: [],
  loading: false,
  error: null,
};

export const fetchLoyaltyPrograms = createAsyncThunk(
  'loyaltyPrograms/fetchLoyaltyPrograms',
  async (merchantId: string, { rejectWithValue }) => {
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      return programs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch loyalty programs');
    }
  }
);

const loyaltyProgramsSlice = createSlice({
  name: 'loyaltyPrograms',
  initialState,
  reducers: {
    clearLoyaltyPrograms: (state) => {
      state.programs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoyaltyPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoyaltyPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
        state.error = null;
      })
      .addCase(fetchLoyaltyPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLoyaltyPrograms } = loyaltyProgramsSlice.actions;

// Selectors
export const selectLoyaltyPrograms = (state: { loyaltyPrograms: LoyaltyProgramsState }) => state.loyaltyPrograms.programs;
export const selectLoyaltyProgramsLoading = (state: { loyaltyPrograms: LoyaltyProgramsState }) => state.loyaltyPrograms.loading;
export const selectLoyaltyProgramsError = (state: { loyaltyPrograms: LoyaltyProgramsState }) => state.loyaltyPrograms.error;

// Helper selector to get a specific loyalty program by ID
export const selectLoyaltyProgramById = (state: { loyaltyPrograms: LoyaltyProgramsState }, programId: string) => 
  state.loyaltyPrograms.programs.find(program => program.id === programId);

export default loyaltyProgramsSlice.reducer;
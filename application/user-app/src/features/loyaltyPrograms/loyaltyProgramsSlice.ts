import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

export interface LoyaltyProgramsState {
  programs: Record<string, LoyaltyProgramDto>; // Normalized by ID
  loading: boolean;
  error: string | null;
}

const initialState: LoyaltyProgramsState = {
  programs: {},
  loading: false,
  error: null,
};

export const fetchLoyaltyPrograms = createAsyncThunk<
  LoyaltyProgramDto[],
  string[],
  { rejectValue: string }
>(
  'loyaltyPrograms/fetchLoyaltyPrograms',
  async (programIds, { rejectWithValue }) => {
    try {
      const result = await apiClient.getLoyaltyPrograms(programIds);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch loyalty programs');
    }
  }
);

const loyaltyProgramsSlice = createSlice({
  name: 'loyaltyPrograms',
  initialState,
  reducers: {
    clearLoyaltyPrograms: (state) => {
      state.programs = {};
      state.error = null;
    },
    
    addLoyaltyProgram: (state, action: PayloadAction<LoyaltyProgramDto>) => {
      state.programs[action.payload.id] = action.payload;
    },
    
    addLoyaltyPrograms: (state, action: PayloadAction<LoyaltyProgramDto[]>) => {
      action.payload.forEach(program => {
        state.programs[program.id] = program;
      });
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
        action.payload.forEach(program => {
          state.programs[program.id] = program;
        });
      })
      .addCase(fetchLoyaltyPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch loyalty programs';
      });
  },
});

export const {
  clearLoyaltyPrograms,
  addLoyaltyProgram,
  addLoyaltyPrograms,
} = loyaltyProgramsSlice.actions;

export const selectLoyaltyPrograms = (state: { loyaltyPrograms: LoyaltyProgramsState }) => 
  state.loyaltyPrograms.programs;

export const selectLoyaltyProgramById = (state: { loyaltyPrograms: LoyaltyProgramsState }, id: string) => 
  state.loyaltyPrograms.programs[id];

export const selectLoyaltyProgramsLoading = (state: { loyaltyPrograms: LoyaltyProgramsState }) => 
  state.loyaltyPrograms.loading;

export const selectLoyaltyProgramsError = (state: { loyaltyPrograms: LoyaltyProgramsState }) => 
  state.loyaltyPrograms.error;

export default loyaltyProgramsSlice.reducer; 
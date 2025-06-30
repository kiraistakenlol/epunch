import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from 'e-punch-common-ui';

const ADMIN_TOKEN_KEY = 'admin_token';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ login, password }: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.authenticateAdmin(login, password);
      localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
      return response.token;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

const getInitialState = (): AuthState => {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  
  return {
    isAuthenticated: !!adminToken,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer; 
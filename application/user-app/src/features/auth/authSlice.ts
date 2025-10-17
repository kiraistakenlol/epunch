import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from 'e-punch-common-ui';

export const LOCAL_STORAGE_USER_ID_KEY = 'epunch_user_id';
export const AUTH_TOKEN_KEY = 'epunch_auth_token';

export interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  superAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  authToken: string | null;
}

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  superAdmin: false,
  isLoading: true,
  error: null,
  authToken: null,
};

export const initializeUser = createAsyncThunk<void, void, {}>(
  'auth/initializeUser',
  async (_, { dispatch }) => {
    const userId = getOrInitializeUserIdFromLocalStorage();
    dispatch(setUserId(userId));

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        return;
      }

      dispatch(setAuthToken(token));

      const backendUser = await apiClient.getCurrentUser();

      dispatch(setUserId(backendUser.id));
      dispatch(setAuthenticated(true));
      dispatch(setSuperAdmin(backendUser.superAdmin));

    } catch (error) {
      console.error('Error during user initialization:', error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.userId = userId;
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId);
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.superAdmin = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to initialize user ID';
      });
  },
});

export const {
  setUserId,
  setAuthenticated,
  setSuperAdmin,
  setAuthToken,
} = authSlice.actions;

export const getOrInitializeUserIdFromLocalStorage = (): string => {
  let userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId);
  }
  return userId;
};

export const selectUserId = (state: { auth: AuthState }) => state.auth.userId;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectSuperAdmin = (state: { auth: AuthState }) => state.auth.superAdmin;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.authToken;

export default authSlice.reducer; 
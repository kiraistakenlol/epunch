import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser, fetchAuthSession, type GetCurrentUserOutput } from 'aws-amplify/auth';
import { apiClient } from 'e-punch-common-ui';

export const LOCAL_STORAGE_USER_ID_KEY = 'epunch_user_id';

export interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  superAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  cognitoUser: GetCurrentUserOutput | null;
}

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  superAdmin: false,
  isLoading: true,
  error: null,
  cognitoUser: null,
};

export const initializeUser = createAsyncThunk<void, void, {}>(
  'auth/initializeUser',
  async (_, { dispatch }) => {
    const userId = getOrInitializeUserIdFromLocalStorage();
    dispatch(setUserId(userId));

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      
      if (!idToken) {
        return;
      }

      const cognitoUser = await getCurrentUser();
      
      const backendUser = await apiClient.getCurrentUser();
      
      // Update state with authenticated user data
      dispatch(setUserId(backendUser.id));
      dispatch(setCognitoUser(cognitoUser));
      dispatch(setAuthenticated(true));
      dispatch(setSuperAdmin(backendUser.superAdmin));
      
    } catch (error) {
      console.error('Error during user initialization:', error);
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
    setCognitoUser: (state, action: PayloadAction<GetCurrentUserOutput | null>) => {
      state.cognitoUser = action.payload;
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
  setCognitoUser,
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

export default authSlice.reducer; 
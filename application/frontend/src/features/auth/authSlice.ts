import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_USER_ID_KEY = 'epunch_user_id';

export interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loadOrInitializeUserId = createAsyncThunk<string, void, {} >(
  'auth/loadOrInitializeUserId',
  async (_, { dispatch }) => {
    let currentUserId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
    if (!currentUserId) {
      currentUserId = uuidv4();
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, currentUserId);
    }
    dispatch(setUserId(currentUserId));
    return currentUserId;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    // Example future actions:
    // loginStart: (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // },
    // loginSuccess: (state, action: PayloadAction<{ token: string; userProfile: any }>) => {
    //   state.isAuthenticated = true;
    //   state.isLoading = false;
    //   state.token = action.payload.token;
    //   state.userProfile = action.payload.userProfile;
    //   // Potentially clear anonymousUserId or handle merging logic here or in a thunk
    // },
    // loginFailure: (state, action: PayloadAction<string>) => {
    //   state.isLoading = false;
    //   state.error = action.payload;
    // },
    // logout: (state) => {
    //   state.isAuthenticated = false;
    //   state.token = null;
    //   state.userProfile = null;
    //   // Don't clear anonymousUserId on logout, user might still want to use app anonymously
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrInitializeUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadOrInitializeUserId.fulfilled, (state, action: PayloadAction<string>) => {
        state.userId = action.payload;
        state.isLoading = false;
      })
      .addCase(loadOrInitializeUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to initialize user ID';
      });
  },
});

export const {
  setUserId,
  // loginStart, loginSuccess, loginFailure, logout // Export future actions
} = authSlice.actions;

// Selectors (Update RootState path if necessary)
// Example: import { RootState } from '../store';
// Make sure your RootState is correctly defined elsewhere and includes the auth slice.
// For example, if your store is: const store = configureStore({ reducer: { auth: authReducer } })
// then RootState would be: type RootState = ReturnType<typeof store.getState>;

export const selectUserId = (state: { auth: AuthState }) => state.auth.userId;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer; 
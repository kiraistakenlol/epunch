import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { apiClient } from 'e-punch-common-ui';
import { MerchantUserLoginDto, JwtPayloadDto, Role } from 'e-punch-common-core';

export interface User {
  id: string;
  login: string;
  merchantId: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const decodeJWT = (token: string): JwtPayloadDto | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Redux: payload', payload);
    
    return {
      userId: payload.userId,
      merchantId: payload.merchantId,
      role: payload.role || ''
    } as JwtPayloadDto;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('merchant_token');
  let user = null;

  if (token) {
    const payload = decodeJWT(token);
    if (payload) {
      user = {
        id: payload.userId,
        login: '',
        merchantId: payload.merchantId,
        role: payload.role
      } as User;
    }
  }

  return {
    token,
    user,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const loginMerchant = createAsyncThunk(
  'auth/loginMerchant',
  async (credentials: MerchantUserLoginDto, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.authenticateMerchant(credentials.merchantSlug, credentials.login, credentials.password);
      const payload: JwtPayloadDto | null = decodeJWT(response.token);

      if (!payload) {
        return rejectWithValue('Invalid token received');
      }

      const merchant = await apiClient.getMerchantById(payload.merchantId);
      
      // Store merchant data in merchant slice
      dispatch({
        type: 'merchant/fetchMerchant/fulfilled',
        payload: merchant
      });

      return {
        token: response.token,
        user: {
          id: payload.userId,
          login: credentials.login,
          merchantId: payload.merchantId,
          role: payload.role
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

export const logoutMerchant = createAsyncThunk(
  'auth/logoutMerchant', 
  async (_, { dispatch }) => {
    // Clear merchant data
    dispatch({ type: 'merchant/clearMerchant' });
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log('Redux: loginStart');
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      localStorage.setItem('merchant_token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      localStorage.removeItem('merchant_token');
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('merchant_token');
    },
    clearError: (state) => {
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginMerchant.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        localStorage.setItem('merchant_token', action.payload.token);
      })
      .addCase(loginMerchant.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = action.payload as string;
        localStorage.removeItem('merchant_token');
      })
      .addCase(logoutMerchant.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('merchant_token');
      });
  },
});

// Selectors
const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => !!auth.token && !!auth.user
);

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 
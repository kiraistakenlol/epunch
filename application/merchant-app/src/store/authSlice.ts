import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MerchantUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  merchant: MerchantUser | null;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('merchant_token');
  const merchantData = localStorage.getItem('merchant_data');
  
  let merchant = null;
  if (merchantData) {
    try {
      merchant = JSON.parse(merchantData);
    } catch (error) {
      localStorage.removeItem('merchant_data');
    }
  }
  
  return {
    isAuthenticated: !!token && !!merchant,
    token,
    merchant,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log('Redux: loginStart');
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; merchant: MerchantUser }>) => {
      console.log('Redux: loginSuccess', action.payload);
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.merchant = action.payload.merchant;
      state.loading = false;
      state.error = null;
      localStorage.setItem('merchant_token', action.payload.token);
      localStorage.setItem('merchant_data', JSON.stringify(action.payload.merchant));
      console.log('Redux: loginSuccess completed, isAuthenticated:', state.isAuthenticated);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      console.log('Redux: loginFailure', action.payload);
      state.isAuthenticated = false;
      state.token = null;
      state.merchant = null;
      state.loading = false;
      state.error = action.payload;
      localStorage.removeItem('merchant_token');
      localStorage.removeItem('merchant_data');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.merchant = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('merchant_token');
      localStorage.removeItem('merchant_data');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 
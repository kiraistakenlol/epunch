import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isSuperAdmin: boolean;
}

interface AuthState {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  const adminData = localStorage.getItem('admin_data');
  
  let adminUser = null;
  if (adminData) {
    try {
      adminUser = JSON.parse(adminData);
    } catch (error) {
      localStorage.removeItem('admin_data');
    }
  }
  
  return {
    adminUser,
    isAuthenticated: !!adminUser,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AdminUser>) => {
      state.isLoading = false;
      state.adminUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('admin_data', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.adminUser = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      localStorage.removeItem('admin_data');
    },
    logout: (state) => {
      state.adminUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('admin_data');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer; 
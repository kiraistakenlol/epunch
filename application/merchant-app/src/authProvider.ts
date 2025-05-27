import { AuthProvider } from 'react-admin';
import { apiClient } from 'e-punch-common-ui';
import { MerchantLoginResponse } from 'e-punch-common-core';
import { store } from './store/store';
import { loginStart, loginSuccess, loginFailure, logout } from './store/authSlice';

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    console.log('AuthProvider: Starting login...');
    store.dispatch(loginStart());
    
    try {
      const response: MerchantLoginResponse = await apiClient.authenticateMerchant(username, password);
      const { token, merchant } = response;
      
      console.log('AuthProvider: API response received:', { token: token?.substring(0, 20) + '...', merchant });
      store.dispatch(loginSuccess({ token, merchant }));
      
      console.log('AuthProvider: Login successful, state updated');
      return Promise.resolve();
    } catch (error: any) {
      console.error('AuthProvider: Login failed:', error);
      store.dispatch(loginFailure(error.message));
      throw new Error(error.message || 'Authentication failed');
    }
  },

  async checkAuth() {
    const state = store.getState();
    const token = state.auth.token;
    const isAuthenticated = state.auth.isAuthenticated;
    
    console.log('AuthProvider: checkAuth called, token exists:', !!token, 'isAuthenticated:', isAuthenticated);
    
    if (!token || !isAuthenticated) {
      console.log('AuthProvider: checkAuth failed - no token or not authenticated');
      throw new Error('Not authenticated');
    }
    
    console.log('AuthProvider: checkAuth passed');
    return Promise.resolve();
  },

  async logout() {
    store.dispatch(logout());
    return Promise.resolve();
  },

  async checkError(error) {
    const status = error.status;
    if (status === 401 || status === 403) {
      store.dispatch(logout());
      throw new Error('Session expired');
    }
    return Promise.resolve();
  },

  async getIdentity() {
    const state = store.getState();
    const merchant = state.auth.merchant;
    
    if (!merchant) {
      throw new Error('No identity available');
    }
    
    return Promise.resolve({
      id: merchant.id,
      fullName: merchant.name,
      avatar: undefined,
    });
  },

  async getPermissions() {
    return Promise.resolve('merchant');
  },
}; 
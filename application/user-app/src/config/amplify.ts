import { config } from './env';
import type { AppDispatch } from '../store/store';
import { getOrInitializeUserIdFromLocalStorage, setAuthenticated, setUserId, setSuperAdmin, setAuthToken } from '../features/auth/authSlice';
import { clearPunchCards } from '../features/punchCards/punchCardsSlice';
import { clearBundles } from '../features/bundles/bundlesSlice';
import { apiClient } from 'e-punch-common-ui';
import { v4 as uuidv4 } from 'uuid';

const AUTH_TOKEN_KEY = 'epunch_auth_token';

export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: config.google.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const initiateGoogleAuth = () => {
  window.location.href = getGoogleAuthUrl();
};

export const handleGoogleCallback = async (code: string, dispatch: AppDispatch) => {
  try {
    const currentUserId = getOrInitializeUserIdFromLocalStorage();

    const authResponse = await apiClient.authenticateUser(code, currentUserId);

    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);

    dispatch(setAuthToken(authResponse.token));
    dispatch(setUserId(authResponse.user.id));
    dispatch(setAuthenticated(true));
    dispatch(setSuperAdmin(authResponse.user.superAdmin));

    return authResponse;
  } catch (error) {
    console.error('Google OAuth authentication failed:', error);
    throw error;
  }
};

export const signOut = (dispatch: AppDispatch) => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  dispatch(setAuthenticated(false));
  dispatch(setSuperAdmin(false));
  dispatch(setAuthToken(null));
  dispatch(setUserId(uuidv4()));
  dispatch(clearPunchCards());
  dispatch(clearBundles());
};

export const getStoredAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}; 
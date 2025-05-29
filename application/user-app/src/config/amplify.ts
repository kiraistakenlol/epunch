import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import { config } from './env';
import type { AppDispatch } from '../store/store';
import { getOrInitializeUserIdFromLocalStorage, setAuthenticated, setCognitoUser, setUserId, setSuperAdmin } from '../features/auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import { v4 as uuidv4 } from 'uuid';

export const configureAmplify = () => {
  if (!config.cognito.userPoolId || !config.cognito.userPoolClientId) {
    console.log('Cognito configuration not found - running in anonymous mode');
    return;
  }

  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: config.cognito.userPoolId,
        userPoolClientId: config.cognito.userPoolClientId,
        region: config.cognito.region,
        signUpVerificationMethod: 'code' as const,
        loginWith: {
          email: true,
          ...(config.cognito.domain && {
            oauth: {
              domain: config.cognito.domain,
              scopes: ['email', 'openid', 'profile'],
              redirectSignIn: [config.cognito.redirectSignIn],
              redirectSignOut: [config.cognito.redirectSignOut],
              responseType: 'code' as const,
            },
          }),
        },
      },
    },
  };

  Amplify.configure(amplifyConfig);
};

export const setupAuthListener = (dispatch: AppDispatch) => {

  const listener = Hub.listen('auth', async ({ payload }) => {
    console.log('Auth event:', payload.event);

    switch (payload.event) {
      case 'signInWithRedirect':
      case 'signedIn':
        try {
          const user = await getCurrentUser();
          console.log('User signed in:', user);

          const currentUserId = getOrInitializeUserIdFromLocalStorage();

          const session = await fetchAuthSession();
          const idToken = session.tokens?.idToken?.toString();

          if (!idToken) {
            console.warn('No access token available. Signing out.');
            signOut();
            return
          }

          console.log('Calling backend auth with token and userId:', { idToken, currentUserId });
          const authResponse = await apiClient.authenticateUser(idToken, currentUserId);
          console.log('Backend auth response:', authResponse);

          dispatch(setUserId(authResponse.user.id));
          dispatch(setCognitoUser(user));
          dispatch(setAuthenticated(true));
          dispatch(setSuperAdmin(authResponse.user.superAdmin));
        } catch (error) {
          console.error('Error getting current user after sign in. Signing out.', error);
          signOut();
        }
        break;

      case 'signedOut':
        console.log('User signed out');
        dispatch(setAuthenticated(false));
        dispatch(setSuperAdmin(false));
        dispatch(setCognitoUser(null));
        dispatch(setUserId(uuidv4()));
        break;

      case 'signInWithRedirect_failure':
        console.error('Sign in with redirect failed:', payload.data);
        break;

      default:
        break;
    }
  });

  return () => {
    listener();
  };
}; 
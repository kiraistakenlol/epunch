import React from 'react';
import { useSelector } from 'react-redux';
import { useI18n } from 'e-punch-common-ui';
import AuthButtons from './AuthButtons';
import { selectIsAuthenticated } from './authSlice';
import { useAppDispatch } from '../../store/hooks';
import { showAuthModal } from './authModalSlice';

const containerStyle: React.CSSProperties = {
  padding: '12px 20px',
};

const messageStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '12px',
  fontSize: '13px',
};

const AuthContainer: React.FC = () => {
  const { t } = useI18n('auth');
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSignInClick = () => {
    dispatch(showAuthModal('signin'));
  };

  const handleSignUpClick = () => {
    dispatch(showAuthModal('signup'));
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        <small>
          {t('syncMessage')}
        </small>
      </div>
      <AuthButtons
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
      />
    </div>
  );
};

export default AuthContainer; 
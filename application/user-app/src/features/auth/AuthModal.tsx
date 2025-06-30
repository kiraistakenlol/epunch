import React, { useState, useEffect } from 'react';
import { useI18n } from 'e-punch-common-ui';
import EPunchModal from '../../components/EPunchModal';
import EmailAuthForm from './EmailAuthForm';
import { signInWithRedirect } from 'aws-amplify/auth';
import { appColors } from '../../theme';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const googleButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#4285f4',
  color: appColors.epunchWhite,
};

const emailButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: appColors.epunchOrange,
  color: appColors.epunchWhite,
};

const switchModeStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: appColors.epunchBlack,
  fontSize: '14px',
};

const linkStyle: React.CSSProperties = {
  color: appColors.epunchOrange,
  cursor: 'pointer',
  textDecoration: 'underline',
};

const backLinkStyle: React.CSSProperties = {
  color: appColors.epunchBlack,
  cursor: 'pointer',
  fontSize: '14px',
  marginBottom: '15px',
  display: 'block',
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const { t } = useI18n('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setShowEmailForm(false);
    setError(null);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      setShowEmailForm(false);
      setError(null);
    }
  }, [isOpen]);

  const handleGoogleAuth = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google auth error:', error);
      setError(t('googleFailed'));
    }
  };

  const handleEmailAuth = () => {
    setShowEmailForm(true);
    setError(null);
  };

  const handleEmailSuccess = () => {
    onClose();
    setShowEmailForm(false);
    setError(null);
  };

  const handleEmailError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setShowEmailForm(false);
    setError(null);
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
    setError(null);
  };

  return (
    <EPunchModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? t('signIn') : t('signUp')}
    >
      {error && (
        <div style={{
          backgroundColor: appColors.epunchRedError,
          color: appColors.epunchWhite,
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {showEmailForm ? (
        <>
          <div style={backLinkStyle} onClick={handleBackToOptions}>
            {t('back')}
          </div>
          <EmailAuthForm
            mode={mode}
            onSuccess={handleEmailSuccess}
            onError={handleEmailError}
          />
        </>
      ) : (
        <>
          <button
            style={emailButtonStyle}
            onClick={handleEmailAuth}
          >
                          {t('continueWithEmail')}
          </button>

          <button
            style={googleButtonStyle}
            onClick={handleGoogleAuth}
          >
                          {t('continueWithGoogle')}
          </button>
        </>
      )}

      <div style={switchModeStyle}>
        {mode === 'signin' ? (
          <>
            {t('noAccount')}{' '}
            <span style={linkStyle} onClick={toggleMode}>
              {t('signUp')}
            </span>
          </>
        ) : (
          <>
            {t('haveAccount')}{' '}
            <span style={linkStyle} onClick={toggleMode}>
              {t('signIn')}
            </span>
          </>
        )}
      </div>
    </EPunchModal>
  );
};

export default AuthModal; 
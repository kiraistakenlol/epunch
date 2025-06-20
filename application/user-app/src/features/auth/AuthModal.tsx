import React, { useState, useEffect } from 'react';
import EPunchModal from '../../components/EPunchModal';
import EmailAuthForm from './EmailAuthForm';
import { signInWithRedirect } from 'aws-amplify/auth';
import { colors } from '../../theme';

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
  backgroundColor: colors.button.google,
  color: colors.text.light,
};

const emailButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: colors.button.orange,
  color: colors.text.light,
};

const switchModeStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: colors.text.disabled,
  fontSize: '14px',
};

const linkStyle: React.CSSProperties = {
  color: colors.button.orange,
  cursor: 'pointer',
  textDecoration: 'underline',
};

const backLinkStyle: React.CSSProperties = {
  color: colors.text.disabled,
  cursor: 'pointer',
  fontSize: '14px',
  marginBottom: '15px',
  display: 'block',
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
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
      setError('Google authentication failed');
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
      title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
    >
      {error && (
        <div style={{
          backgroundColor: colors.modal.errorBg,
          color: colors.modal.errorText,
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
            ← Back
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
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.button.orangeHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.button.orange;
            }}
          >
            Continue with Email
          </button>

          <button
            style={googleButtonStyle}
            onClick={handleGoogleAuth}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.button.googleHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.button.google;
            }}
          >
            Continue with Google
          </button>
        </>
      )}
      
      <div style={switchModeStyle}>
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <span style={linkStyle} onClick={toggleMode}>
              Sign up
            </span>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <span style={linkStyle} onClick={toggleMode}>
              Sign in
            </span>
          </>
        )}
      </div>
    </EPunchModal>
  );
};

export default AuthModal; 
import React, { useState, useEffect } from 'react';
import { EPunchModal } from 'e-punch-common-ui';
import EmailAuthForm from './EmailAuthForm';
import { signInWithRedirect } from 'aws-amplify/auth';

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
  color: 'white',
};

const emailButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#ff9500',
  color: 'white',
};

const switchModeStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: '#666',
  fontSize: '14px',
};

const linkStyle: React.CSSProperties = {
  color: '#ff9500',
  cursor: 'pointer',
  textDecoration: 'underline',
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

  return (
    <EPunchModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
    >
      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {showEmailForm ? (
        <EmailAuthForm
          mode={mode}
          onSuccess={handleEmailSuccess}
          onError={handleEmailError}
        />
      ) : (
        <>
          <button
            style={emailButtonStyle}
            onClick={handleEmailAuth}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e6850e';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ff9500';
            }}
          >
            Continue with Email
          </button>

          <button
            style={googleButtonStyle}
            onClick={handleGoogleAuth}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3367d6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4285f4';
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
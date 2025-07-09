import React, { useState, useEffect } from 'react';
import { useI18n } from 'e-punch-common-ui';
import EPunchModal from '../../components/EPunchModal';
import { signInWithRedirect } from 'aws-amplify/auth';
import { signUp, signIn } from 'aws-amplify/auth';
import { appColors } from '../../theme';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  margin: '6px 0',
  border: `1px solid #f0f0f0`,
  borderRadius: '8px',
  fontSize: '15px',
  fontFamily: 'inherit',
  backgroundColor: '#fafbfc',
  transition: 'all 0.2s ease',
  outline: 'none',
  color: '#6b7280',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  margin: '8px 0',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: appColors.epunchOrange,
  color: appColors.epunchWhite,
  fontWeight: '500',
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#ffa366',
  color: '#ffffff',
  fontWeight: '500',
  cursor: 'not-allowed',
  opacity: 0.7,
};

const googleButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#1a1a1a',
  color: appColors.epunchWhite,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  margin: '24px 0',
  color: '#6b7280',
  fontSize: '14px',
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  backgroundColor: '#e1e5e9',
};

const switchModeStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: '#6b7280',
  fontSize: '14px',
};

const linkStyle: React.CSSProperties = {
  color: appColors.epunchOrange,
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: '500',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  color: '#dc2626',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '16px',
  fontSize: '14px',
  border: '1px solid #fecaca',
};

const passwordContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const passwordToggleStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '18px',
  userSelect: 'none',
  zIndex: 1,
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const { t } = useI18n('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
      } else {
        await signIn({
          username: email,
          password,
        });
      }
      onClose();
    } catch (error: any) {
      setError(error.message || t('authFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error) {
      console.error('Google auth error:', error);
      setError(t('googleFailed'));
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '' && isValidEmail(email.trim());

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <EPunchModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'signin' ? t('signIn') : t('signUp')}
    >
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <button
        style={googleButtonStyle}
        onClick={handleGoogleAuth}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.5 10.49a4.8 4.8 0 0 1 0-3.07V5.35H1.83a8 8 0 0 0 0 7.28l2.67-2.14z"/>
          <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.59a8.025 8.025 0 0 0-5.98-2.336A8 8 0 0 0 1.83 5.35L4.5 7.49a4.77 4.77 0 0 1 4.48-3.91z"/>
        </svg>
        {t('continueWithGoogle')}
      </button>

      <div style={dividerStyle}>
        <div style={dividerLineStyle}></div>
        <span style={{ margin: '0 16px' }}>OR</span>
        <div style={dividerLineStyle}></div>
      </div>

      <form onSubmit={handleEmailAuth}>
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        
        <div style={passwordContainerStyle}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <div style={passwordToggleStyle} onClick={togglePasswordVisibility}>
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </div>
        </div>

        <button
          type="submit"
          style={loading || !isFormValid ? disabledButtonStyle : primaryButtonStyle}
          disabled={loading || !isFormValid}
        >
          {loading ? t('loading') : (mode === 'signin' ? t('signIn') : t('signUp'))}
        </button>
      </form>

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
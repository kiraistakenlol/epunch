import React, { useState } from 'react';
import { useI18n } from 'e-punch-common-ui';
import { appColors } from '../../theme';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
  onError: (error: string) => void;
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle: React.CSSProperties = {
  padding: '12px',
  border: `1px solid ${appColors.epunchBeige}`,
  borderRadius: '6px',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: appColors.epunchOrange,
  color: appColors.epunchWhite,
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
};

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ mode, onSuccess: _onSuccess, onError }) => {
  const { t } = useI18n('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, _setIsLoading] = useState(false);
  const [needsConfirmation, _setNeedsConfirmation] = useState(false);

  const handleSignUp = async () => {
    onError('Email/password authentication is not implemented. Please use Google Sign-In.');
  };

  const handleConfirmSignUp = async () => {
    onError('Email/password authentication is not implemented. Please use Google Sign-In.');
  };

  const handleSignIn = async () => {
    onError('Email/password authentication is not implemented. Please use Google Sign-In.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsConfirmation) {
      handleConfirmSignUp();
    } else if (mode === 'signup') {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  if (needsConfirmation) {
    return (
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: appColors.epunchBlack }}>{t('checkEmail')}</h3>
          <p style={{ margin: 0, color: appColors.epunchBlack, fontSize: '14px' }}>
            {t('verificationSent', { email })}
          </p>
        </div>
        
        <input
          type="text"
          placeholder={t('enterCode')}
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          style={inputStyle}
          required
        />
        
        <button
          type="submit"
          style={buttonStyle}
          disabled={isLoading}
        >
          {isLoading ? t('verifying') : t('verifyEmail')}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="email"
        placeholder={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        required
      />
      
      <input
        type="password"
        placeholder={t('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        required
      />
      
      <button
        type="submit"
        style={buttonStyle}
        disabled={isLoading}
      >
        {isLoading 
                  ? (mode === 'signup' ? t('creatingAccount') : t('signingIn'))
        : (mode === 'signup' ? t('createAccount') : t('signIn'))
        }
      </button>
    </form>
  );
};

export default EmailAuthForm; 
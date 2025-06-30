import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useLocalization } from 'e-punch-common-ui';
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

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ mode, onSuccess, onError }) => {
  const { t } = useLocalization();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      setNeedsConfirmation(true);
    } catch (error: any) {
      onError(error.message || t('auth.signUpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      setIsLoading(true);
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      
      // Automatically sign in after successful verification
      await signIn({
        username: email,
        password,
      });
      
      onSuccess();
    } catch (error: any) {
      onError(error.message || t('auth.confirmationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn({
        username: email,
        password,
      });
      onSuccess();
    } catch (error: any) {
      onError(error.message || t('auth.signInFailed'));
    } finally {
      setIsLoading(false);
    }
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
          <h3 style={{ margin: '0 0 10px 0', color: appColors.epunchBlack }}>{t('auth.checkEmail')}</h3>
          <p style={{ margin: 0, color: appColors.epunchBlack, fontSize: '14px' }}>
            {t('auth.verificationSent', { email })}
          </p>
        </div>
        
        <input
          type="text"
          placeholder={t('auth.enterCode')}
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
          {isLoading ? t('auth.verifying') : t('auth.verifyEmail')}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="email"
        placeholder={t('auth.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        required
      />
      
      <input
        type="password"
        placeholder={t('auth.password')}
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
          ? (mode === 'signup' ? t('auth.creatingAccount') : t('auth.signingIn')) 
          : (mode === 'signup' ? t('auth.createAccount') : t('auth.signIn'))
        }
      </button>
    </form>
  );
};

export default EmailAuthForm; 
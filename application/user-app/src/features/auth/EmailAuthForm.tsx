import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { colors } from '../../theme';

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
  border: `1px solid ${colors.modal.border}`,
  borderRadius: '6px',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: colors.button.orange,
  color: colors.text.light,
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
};

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ mode, onSuccess, onError }) => {
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
      onError(error.message || 'Sign up failed');
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
      onError(error.message || 'Confirmation failed');
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
      onError(error.message || 'Sign in failed');
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
          <h3 style={{ margin: '0 0 10px 0', color: colors.text.primary }}>Check Your Email</h3>
          <p style={{ margin: 0, color: colors.text.disabled, fontSize: '14px' }}>
            We sent a verification code to {email}
          </p>
        </div>
        
        <input
          type="text"
          placeholder="Enter verification code"
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
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
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
          ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...') 
          : (mode === 'signup' ? 'Create Account' : 'Sign In')
        }
      </button>
    </form>
  );
};

export default EmailAuthForm; 
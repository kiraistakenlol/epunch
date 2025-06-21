import React from 'react';
import { appColors } from '../../theme';

interface AuthButtonsProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const buttonBaseStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '80px',
};

const signInButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: appColors.epunchOrange,
  color: appColors.epunchWhite,
};

const signUpButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: 'transparent',
  color: appColors.epunchOrange,
  border: `1px solid ${appColors.epunchOrange}`,
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
};

const AuthButtons: React.FC<AuthButtonsProps> = ({ onSignInClick, onSignUpClick }) => {
  return (
    <div style={buttonContainerStyle}>
      <button 
        style={signInButtonStyle}
        onClick={onSignInClick}
      >
        Sign In
      </button>
      <span style={{ color: appColors.epunchBlack, fontSize: '14px', alignSelf: 'center' }}>or</span>
      <button 
        style={signUpButtonStyle}
        onClick={onSignUpClick}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtons; 
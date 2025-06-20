import React from 'react';
import { colors } from '../../theme';

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
  backgroundColor: colors.warning.main,
  color: colors.text.light,
};

const signUpButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: 'transparent',
  color: colors.warning.main,
  border: `1px solid ${colors.warning.main}`,
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
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.warning.main;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = colors.warning.main;
        }}
      >
        Sign In
      </button>
      <span style={{ color: colors.text.disabled, fontSize: '14px', alignSelf: 'center' }}>or</span>
      <button 
        style={signUpButtonStyle}
        onClick={onSignUpClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.hover.background;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthButtons; 
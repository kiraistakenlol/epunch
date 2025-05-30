import React from 'react';

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
  backgroundColor: '#ff9500',
  color: 'white',
};

const signUpButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: 'transparent',
  color: '#ff9500',
  border: '1px solid #ff9500',
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
          e.currentTarget.style.backgroundColor = '#e6850e';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#ff9500';
        }}
      >
        Sign In
      </button>
      <span style={{ color: '#8b7355', fontSize: '14px', alignSelf: 'center' }}>or</span>
      <button 
        style={signUpButtonStyle}
        onClick={onSignUpClick}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#fff5e6';
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
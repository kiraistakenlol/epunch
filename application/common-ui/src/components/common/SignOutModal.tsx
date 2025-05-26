import React from 'react';
import EPunchModal from './EPunchModal';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

const confirmButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#d32f2f',
  color: 'white',
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#f5f5f5',
  color: '#333',
  border: '1px solid #ddd',
};

const messageStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#666',
  fontSize: '16px',
  lineHeight: '1.5',
};

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <EPunchModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Sign Out"
      maxWidth="350px"
    >
      <div style={messageStyle}>
        Are you sure you want to sign out? You'll continue using the app with your anonymous account.
      </div>
      
      <button
        style={confirmButtonStyle}
        onClick={handleConfirm}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#b71c1c';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f';
        }}
      >
        Sign Out
      </button>
      
      <button
        style={cancelButtonStyle}
        onClick={onClose}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
      >
        Cancel
      </button>
    </EPunchModal>
  );
};

export default SignOutModal; 
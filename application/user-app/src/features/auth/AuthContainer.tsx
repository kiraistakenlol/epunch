import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AuthButtons from './AuthButtons';
import AuthModal from './AuthModal';
import { selectIsAuthenticated } from './authSlice';

const containerStyle: React.CSSProperties = {
  backgroundColor: '#f5f5dc',
  padding: '12px 20px',
  borderBottom: '1px solid #e0e0e0',
  marginTop: '70px',
};

const AuthContainer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSignInClick = () => {
    setModalMode('signin');
    setIsModalOpen(true);
  };

  const handleSignUpClick = () => {
    setModalMode('signup');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <small style={{ color: '#8b7355', fontSize: '13px' }}>
            Sign in to sync your punch cards across devices and keep them secure
          </small>
        </div>
        <AuthButtons 
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
        />
      </div>
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialMode={modalMode}
      />
    </>
  );
};

export default AuthContainer; 
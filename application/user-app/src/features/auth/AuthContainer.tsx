import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AuthButtons from './AuthButtons';
import AuthModal from './AuthModal';
import { selectIsAuthenticated } from './authSlice';

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
      <AuthButtons 
        onSignInClick={handleSignInClick}
        onSignUpClick={handleSignUpClick}
      />
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialMode={modalMode}
      />
    </>
  );
};

export default AuthContainer; 
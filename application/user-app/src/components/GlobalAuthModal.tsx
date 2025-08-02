import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectAuthModalIsOpen, selectAuthModalInitialMode, hideAuthModal } from '../features/auth/authModalSlice';
import AuthModal from '../features/auth/AuthModal';

const GlobalAuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectAuthModalIsOpen);
  const initialMode = useAppSelector(selectAuthModalInitialMode);

  const handleClose = () => {
    dispatch(hideAuthModal());
  };

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      initialMode={initialMode}
    />
  );
};

export default GlobalAuthModal;
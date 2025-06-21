import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EPunchModal from './EPunchModal';
import type { RootState } from '../store/store';
import { appColors } from '../theme';
import { selectSignOutModalOpen, closeSignOutModal } from '../features/signOut/signOutSlice';
import { signOut } from 'aws-amplify/auth';

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
  backgroundColor: appColors.epunchRedError,
  color: appColors.epunchWhite,
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: appColors.epunchWhite,
  color: appColors.epunchBlack,
};

const messageStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
  color: appColors.epunchBlack,
  fontSize: '16px',
  lineHeight: '1.5',
};

const SignOutModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => selectSignOutModalOpen(state));

  const handleClose = () => {
    dispatch(closeSignOutModal());
  };

  const handleConfirm = async () => {
    try {
      await signOut();
      dispatch(closeSignOutModal());
    } catch (error) {
      console.error('Error signing out:', error);
      dispatch(closeSignOutModal());
    }
  };

  return (
    <EPunchModal
      isOpen={isOpen}
      onClose={handleClose}
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
          e.currentTarget.style.backgroundColor = appColors.epunchRedDanger;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = appColors.epunchRedDanger;
        }}
      >
        Sign Out
      </button>
      
      <button
        style={cancelButtonStyle}
        onClick={handleClose}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = appColors.epunchBeige;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = appColors.epunchBeige;
        }}
      >
        Cancel
      </button>
    </EPunchModal>
  );
};

export default SignOutModal; 
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useI18n } from 'e-punch-common-ui';
import EPunchModal from './EPunchModal';
import type { RootState, AppDispatch } from '../store/store';
import { appColors } from '../theme';
import { selectSignOutModalOpen, closeSignOutModal } from '../features/signOut/signOutSlice';
import { signOut } from '../config/amplify';

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
  const { t } = useI18n('common');
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => selectSignOutModalOpen(state));

  const handleClose = () => {
    dispatch(closeSignOutModal());
  };

  const handleConfirm = () => {
    try {
      signOut(dispatch);
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
      title={t('signOut.title')}
      maxWidth="350px"
    >
      <div style={messageStyle}>
        {t('signOut.message')}
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
        {t('signOut.confirm')}
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
        {t('signOut.cancel')}
      </button>
    </EPunchModal>
  );
};

export default SignOutModal; 
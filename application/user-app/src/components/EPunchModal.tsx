import React from 'react';
import ReactModal from 'react-modal';
import { appColors } from '../theme';

interface EPunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const modalStyles: ReactModal.Styles = {
  overlay: {
    zIndex: 2000,
    backgroundColor: `${appColors.epunchBlack}80`,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    border: 'none',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
};

const headerStyle: React.CSSProperties = {
  color: appColors.epunchBlack,
  padding: '20px',
  textAlign: 'center',
  fontSize: '1.2em',
  fontWeight: 'bold',
  position: 'relative',
};

const contentStyle: React.CSSProperties = {
  padding: '30px',
  backgroundColor: appColors.epunchWhite,
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '24px',
  color: appColors.epunchBlack,
  cursor: 'pointer',
  padding: '0',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const EPunchModal: React.FC<EPunchModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '400px' 
}) => {
  const customModalStyles = {
    ...modalStyles,
    content: {
      ...modalStyles.content,
      maxWidth,
    },
  };

  const Modal = ReactModal as any;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel={title}
      ariaHideApp={false}
    >
      <div style={{ position: 'relative' }}>
        <div style={headerStyle}>
          {title}
          <button style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default EPunchModal; 
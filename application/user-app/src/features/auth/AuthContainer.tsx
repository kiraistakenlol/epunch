import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useI18n } from 'e-punch-common-ui';
import AuthButtons from './AuthButtons';
import AuthModal from './AuthModal';
import { selectIsAuthenticated } from './authSlice';

const AuthContainer: React.FC = () => {
  const { t } = useI18n('auth');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const shouldShowMessage = (): boolean => {
    // Hide message on very small screens to save space
    return !(windowSize.height <= 700 || windowSize.width <= 500);
  };

  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle = {
    };

    // Apply responsive adjustments based on screen size
    if (windowSize.height <= 600 || windowSize.width <= 400) {
      return {
        ...baseStyle,
        padding: '5px 10px',
      };
    } else if (windowSize.height <= 700 || windowSize.width <= 500) {
      return {
        ...baseStyle,
        padding: '8px 12px',
      };
    }

    return {
      ...baseStyle,
      padding: '12px 20px',
    };
  };

  const getTextStyle = (): React.CSSProperties => {
    const baseStyle = {
    };

    if (windowSize.height <= 600 || windowSize.width <= 400) {
      return {
        ...baseStyle,
        fontSize: '11px',
      };
    } else if (windowSize.height <= 700 || windowSize.width <= 500) {
      return {
        ...baseStyle,
        fontSize: '12px',
      };
    }

    return {
      ...baseStyle,
      fontSize: '13px',
    };
  };

  const getTextContainerMarginBottom = (): string => {
    if (windowSize.height <= 600 || windowSize.width <= 400) {
      return '6px';
    } else if (windowSize.height <= 700 || windowSize.width <= 500) {
      return '8px';
    }
    return '12px';
  };

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
      <div style={getContainerStyle()}>
        {shouldShowMessage() && (
          <div style={{ textAlign: 'center', marginBottom: getTextContainerMarginBottom() }}>
            <small style={getTextStyle()}>
              {t('syncMessage')}
            </small>
          </div>
        )}
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
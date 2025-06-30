import React from 'react';
import { useI18n } from '../localization';

interface LanguageSwitchProps {
  variant?: 'default' | 'landing';
  className?: string;
  style?: React.CSSProperties;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ 
  variant = 'default', 
  className = '',
  style = {}
}) => {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  const defaultStyle: React.CSSProperties = {
    padding: '4px 8px',
    background: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '10px',
    transition: 'all 0.2s ease',
    ...style
  };

  const landingStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: 'transparent',
    border: '2px solid #333',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    color: '#333',
    ...style
  };

  const buttonStyle = variant === 'landing' ? landingStyle : defaultStyle;

  return (
    <button
      onClick={toggleLanguage}
      className={className}
      style={buttonStyle}
      onMouseOver={(e) => {
        if (variant === 'landing') {
          e.currentTarget.style.backgroundColor = '#333';
          e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseOut={(e) => {
        if (variant === 'landing') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#333';
        }
      }}
    >
      {locale.toUpperCase()}
    </button>
  );
};

export default LanguageSwitch; 
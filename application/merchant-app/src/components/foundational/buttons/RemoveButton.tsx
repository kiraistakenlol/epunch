import React from 'react';

interface RemoveButtonProps {
  onClick: () => void;
  title?: string;
  size?: number;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({
  onClick,
  title = "Remove",
  size = 18,
  top = '-6px',
  right = '-6px',
  left,
  bottom
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top,
        right,
        left,
        bottom,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: `${Math.floor(size * 0.6)}px`,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
        transition: 'all 0.2s ease',
        zIndex: 10
      }}
      title={title}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#d32f2f';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f44336';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      ×
    </button>
  );
}; 
import React from 'react';
import { ScreenProps } from '../../../types';

const EmptyScreen: React.FC<ScreenProps> = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px'
    }}>
      Empty Screen
    </div>
  );
};

export default EmptyScreen; 
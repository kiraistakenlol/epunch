import React from 'react';
import { PhoneWithUserApp } from '../../components/shared';

const UserAppTestPage: React.FC = () => {
  const userAppUrl = import.meta.env.VITE_USER_APP_URL || 'http://localhost:5173';

  return (
    <div style={{ padding: '20px' }}>
      <h1>PhoneWithUserApp Test Page</h1>
      <p>Different phone sizes to test scaling behavior. Check console for debug info.</p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '40px', 
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      }}>
        <div style={{ width: '360px' }}>
          <p style={{ margin: '5px', fontSize: '12px' }}>60px</p>
          <PhoneWithUserApp 
            src={userAppUrl}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default UserAppTestPage; 
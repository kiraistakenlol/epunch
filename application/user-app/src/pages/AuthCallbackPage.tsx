import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleGoogleCallback } from '../config/amplify';
import type { AppDispatch } from '../store/store';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (!code) {
      navigate('/');
      return;
    }

    handleGoogleCallback(code, dispatch)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      });
  }, [searchParams, navigate, dispatch]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ fontSize: '18px', color: '#dc2626' }}>{error}</div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Redirecting...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ fontSize: '18px', color: '#6b7280' }}>Authenticating...</div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #ff7b36',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallbackPage;

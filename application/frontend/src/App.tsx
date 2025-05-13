import { useEffect, useState } from 'react';
import { apiClient } from './apiClient';
import { ApiResponse } from 'e-punch-common';

function App() {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const response = await apiClient.getHelloWorld();
        if (response.error) {
          setError(response.error);
        } else {
          setMessage(response.data || '');
        }
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default App; 
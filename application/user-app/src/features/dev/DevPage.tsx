import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { selectUserId } from '../auth/authSlice';
import { apiClient } from '../../apiClient';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#424242',
    color: '#f5f5dc',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  sectionTitle: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginTop: 0,
  },
  button: {
    backgroundColor: '#5d4037',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    marginBottom: '10px',
  },
  statusBox: {
    padding: '10px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    marginTop: '10px',
    minHeight: '100px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    fontFamily: 'monospace',
  },
  userInfo: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
  }
};

const DevPage: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const [apiStatus, setApiStatus] = useState<string>('No API calls made yet');
  const [loading, setLoading] = useState<boolean>(false);

  const checkBackendConnection = async () => {
    setLoading(true);
    setApiStatus('Checking backend connection...');
    try {
      const response = await apiClient.checkDevEndpoint();
      setApiStatus(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setApiStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = async () => {
    setLoading(true);
    setApiStatus('Generating test data...');
    try {
      const response = await apiClient.generateTestData();
      setApiStatus(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setApiStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetTestData = async () => {
    setLoading(true);
    setApiStatus('Resetting test data...');
    try {
      const response = await apiClient.resetTestData();
      setApiStatus(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setApiStatus(`Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>E-PUNCH.io Development Tools</h1>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>User Information</h2>
        <div style={styles.userInfo}>
          <p><strong>Current User ID:</strong> {userId || 'Not set'}</p>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>API Testing</h2>
        <div>
          <button 
            style={styles.button} 
            onClick={checkBackendConnection}
            disabled={loading}
          >
            Check Backend Connection
          </button>
          <button 
            style={styles.button} 
            onClick={generateTestData}
            disabled={loading}
          >
            Generate Test Data
          </button>
          <button 
            style={styles.button} 
            onClick={resetTestData}
            disabled={loading}
          >
            Reset Test Data
          </button>
        </div>
        <div>
          <h3>Response:</h3>
          <pre style={styles.statusBox}>
            {apiStatus}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default DevPage; 
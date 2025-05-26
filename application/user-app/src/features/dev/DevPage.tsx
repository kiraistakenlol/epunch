import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { LOCAL_STORAGE_USER_ID_KEY, selectUserId, setUserId } from '../auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import { useWebSocket } from '../../hooks/useWebSocket';
import { webSocketClient } from '../../api/websocketClient';


// Reusable collapsible section component
interface DevSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const DevSection: React.FC<DevSectionProps> = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section style={styles.section}>
      <div 
        style={styles.sectionHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 style={styles.sectionTitle}>{title}</h2>
        <span style={styles.toggleIcon}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>
      {isExpanded && (
        <div style={styles.sectionContent}>
          {children}
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    paddingTop: '70px',
    paddingBottom: '40px',
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
    borderBottom: 'none',
    paddingBottom: '0',
    marginTop: 0,
    marginBottom: 0,
    fontFamily: 'monospace',
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
  },
  inputField: {
    padding: '8px',
    marginRight: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none' as const,
    padding: '5px 0',
    borderBottom: '1px solid #ddd',
    marginBottom: '10px',
  },
  toggleIcon: {
    fontSize: '14px',
    color: '#666',
    transition: 'transform 0.2s ease',
  },
  sectionContent: {
    marginTop: '10px',
  },
};

const DevPage: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState<string>('No API calls made yet');
  const [loading, setLoading] = useState<boolean>(false);
  const [customUserId, setCustomUserId] = useState<string>('412dbe6d-e933-464e-87e2-31fe9c9ee6ac');
  const [testPunchUserId, setTestPunchUserId] = useState<string>(userId || '');
  const [testPunchStatus, setTestPunchStatus] = useState<string>('');
  
  const { connected, error: wsError, events, clearEvents } = useWebSocket();

  // Update test punch user ID when current user ID changes
  useEffect(() => {
    if (userId && !testPunchUserId) {
      setTestPunchUserId(userId);
    }
  }, [userId, testPunchUserId]);

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

  const handleRemoveUserId = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY);
    dispatch(setUserId(null as any));
    setApiStatus(`User ID removed from local storage. Current Redux User ID: null. Please reload or re-initialize to see changes in some parts of the app.`);
  };

  const handleSetCustomUserId = () => {
    if (customUserId.trim() === '') {
      setApiStatus('Custom User ID cannot be empty.');
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, customUserId);
    dispatch(setUserId(customUserId));
    setApiStatus(`User ID set to "${customUserId}" in local storage and Redux. Current Redux User ID: ${customUserId}.`);
  };

  const sendTestEvent = () => {
    if (webSocketClient.isConnected()) {
      webSocketClient['socket']?.emit('test', {
        message: 'Test message from frontend',
        userId: userId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleTestPunch = async () => {
    const loyaltyProgramId = "ca8a6765-e272-4aaa-b7a9-c25863ff1678"; // Placeholder

    if (!testPunchUserId.trim()) {
      setTestPunchStatus("Test Punch Error: Please enter a User ID.");
      return;
    }

    if (!loyaltyProgramId) {
      setTestPunchStatus("Test Punch Error: Placeholder Loyalty Program ID is not configured.");
      return;
    }

    setLoading(true);
    setTestPunchStatus("Processing test punch...");

    try {
      console.log(`Attempting TEST punch for user: ${testPunchUserId} on program: ${loyaltyProgramId}`);
      const result = await apiClient.recordPunch(testPunchUserId, loyaltyProgramId);
      setTestPunchStatus(`Test Punch Success: Reward achieved: ${result.rewardAchieved}. Current punches: ${result.current_punches}/${result.required_punches}`);
    } catch (error: any) {
      console.error('Test Punch error:', error);
      setTestPunchStatus(`Test Punch Error: ${error.response?.data?.message || error.message || 'Failed to record test punch.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>E-PUNCH.io Development Tools</h1>
      </header>

      <DevSection title="Navigation">
        <div>
          <button 
            style={styles.button} 
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </button>
        </div>
      </DevSection>

      <DevSection title="User Information">
        <div style={styles.userInfo}>
          <p><strong>Current User ID:</strong> {userId || 'Not set'}</p>
        </div>
        <div>
          <button 
            style={styles.button} 
            onClick={handleRemoveUserId}
            disabled={loading}
          >
            Remove User ID (from Local Storage & Redux)
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text"
            style={styles.inputField}
            value={customUserId}
            onChange={(e) => setCustomUserId(e.target.value)}
            placeholder="Enter custom User ID"
          />
          <button 
            style={styles.button} 
            onClick={handleSetCustomUserId}
            disabled={loading}
          >
            Set User ID (to Local Storage & Redux)
          </button>
        </div>
      </DevSection>

      <DevSection title="API Testing">
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
      </DevSection>

      <DevSection title="WebSocket Connection">
        <div style={styles.userInfo}>
          <p><strong>Connection Status:</strong> 
            <span style={{ 
              color: connected ? 'green' : 'red', 
              marginLeft: '10px' 
            }}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
          {wsError && (
            <p><strong>Error:</strong> <span style={{ color: 'red' }}>{wsError}</span></p>
          )}
        </div>
        <div>
          <button 
            style={styles.button} 
            onClick={clearEvents}
            disabled={loading}
          >
            Clear Events ({events.length})
          </button>
          <button 
            style={styles.button} 
            onClick={sendTestEvent}
            disabled={loading || !connected}
          >
            Send Test Event
          </button>
        </div>
        <div>
          <h3>Real-time Events:</h3>
          <div style={{ 
            ...styles.statusBox, 
            maxHeight: '300px', 
            fontSize: '12px' 
          }}>
            {events.length === 0 ? (
              <div style={{ color: '#666' }}>No events received yet...</div>
            ) : (
              events.slice().reverse().map((event, index) => (
                <div key={index} style={{ 
                  marginBottom: '10px', 
                  padding: '8px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  borderLeft: '4px solid #2196F3'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    {event.type} - {event.timestamp.toLocaleTimeString()}
                  </div>
                  <pre style={{ 
                    margin: '4px 0 0 0', 
                    fontSize: '10px', 
                    color: '#444',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </DevSection>

      <DevSection title="Merchant Testing">
        <div>
          <h3>Test Punch Recording</h3>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text"
              style={styles.inputField}
              value={testPunchUserId}
              onChange={(e) => setTestPunchUserId(e.target.value)}
              placeholder="Enter User ID for test punch"
            />
            <button 
              style={styles.button} 
              onClick={handleTestPunch}
              disabled={loading}
            >
              Test Punch
            </button>
          </div>
          <div>
            <h4>Test Punch Result:</h4>
            <pre style={{
              ...styles.statusBox,
              color: testPunchStatus.startsWith('Test Punch Error:') ? 'red' : 
                     testPunchStatus.startsWith('Test Punch Success:') ? 'green' : 'black'
            }}>
              {testPunchStatus || 'No test punch performed yet'}
            </pre>
          </div>
        </div>
      </DevSection>
    </div>
  );
};

export default DevPage; 
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { LOCAL_STORAGE_USER_ID_KEY, selectUserId, setUserId } from '../auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import { useWebSocket } from '../../hooks/useWebSocket';
import { webSocketClient } from '../../api/websocketClient';
import { useConsoleCapture, ConsoleMessage } from '../../hooks/useConsoleCapture';


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
  const { messages: consoleMessages, clearMessages: clearConsoleMessages } = useConsoleCapture();

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

      <DevSection title="Console Debug (Mobile Safari)" defaultExpanded={true}>
        <div style={styles.userInfo}>
          <p><strong>Console Messages:</strong> {consoleMessages.length} captured</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            All console.log, console.error, console.warn, and unhandled errors are captured here for mobile debugging.
          </p>
        </div>
        <div>
          <button 
            style={styles.button} 
            onClick={clearConsoleMessages}
            disabled={loading}
          >
            Clear Console ({consoleMessages.length})
          </button>
          <button 
            style={styles.button} 
            onClick={() => {
              console.log('Test log message', { timestamp: new Date() });
              console.warn('Test warning message');
              console.error('Test error message');
            }}
            disabled={loading}
          >
            Generate Test Messages
          </button>
        </div>
        <div>
          <h3>Console Output:</h3>
          <div style={{ 
            ...styles.statusBox, 
            maxHeight: '400px', 
            fontSize: '11px',
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            border: '1px solid #333'
          }}>
            {consoleMessages.length === 0 ? (
              <div style={{ color: '#888' }}>No console messages captured yet...</div>
            ) : (
              consoleMessages.map((msg) => {
                const getMessageColor = (type: ConsoleMessage['type']) => {
                  switch (type) {
                    case 'error': return '#ff6b6b';
                    case 'warn': return '#ffd93d';
                    case 'info': return '#74c0fc';
                    case 'log': return '#f0f0f0';
                    default: return '#f0f0f0';
                  }
                };

                const getTypeIcon = (type: ConsoleMessage['type']) => {
                  switch (type) {
                    case 'error': return '❌';
                    case 'warn': return '⚠️';
                    case 'info': return 'ℹ️';
                    case 'log': return '📝';
                    default: return '📝';
                  }
                };

                return (
                                     <div key={msg.id} style={{ 
                     marginBottom: '8px', 
                     padding: '6px', 
                     backgroundColor: msg.type === 'error' ? '#2d1b1b' : msg.type === 'warn' ? '#2d2a1b' : '#1a1a1a', 
                     borderRadius: '3px',
                     borderLeft: `3px solid ${getMessageColor(msg.type)}`,
                     fontSize: '10px'
                   }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ 
                        color: getMessageColor(msg.type), 
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}>
                        {getTypeIcon(msg.type)} {msg.type.toUpperCase()}
                      </span>
                      <span style={{ 
                        color: '#888', 
                        fontSize: '9px' 
                      }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: '10px', 
                      color: '#f0f0f0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {msg.message}
                    </pre>
                    {msg.stack && (
                      <details style={{ marginTop: '4px' }}>
                        <summary style={{ 
                          color: '#888', 
                          fontSize: '9px', 
                          cursor: 'pointer' 
                        }}>
                          Stack trace
                        </summary>
                        <pre style={{ 
                          margin: '4px 0 0 0', 
                          fontSize: '9px', 
                          color: '#ccc',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })
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
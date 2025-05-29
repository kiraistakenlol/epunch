import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { LOCAL_STORAGE_USER_ID_KEY, selectUserId, setUserId } from '../auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import { useWebSocket } from '../../hooks/useWebSocket';
import { webSocketClient } from '../../api/websocketClient';
import { useConsoleCapture, ConsoleMessage } from '../../hooks/useConsoleCapture';
import type { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';


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
  const [testPunchStatus, setTestPunchStatus] = useState<string>('');
  const [merchants, setMerchants] = useState<MerchantDto[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
  
  // Scenario Testing States
  const [scenarioMerchantId, setScenarioMerchantId] = useState<string>('');
  const [scenarioLoyaltyPrograms, setScenarioLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [scenarioLoyaltyProgramId, setScenarioLoyaltyProgramId] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [scenarioStatus, setScenarioStatus] = useState<string>('');
  const [scenarioExecuting, setScenarioExecuting] = useState<boolean>(false);
  
  const { connected, error: wsError, events, clearEvents } = useWebSocket();
  const { messages: consoleMessages, clearMessages: clearConsoleMessages } = useConsoleCapture();

  // Available scenarios
  const scenarios = {
    'complete-card': {
      name: 'Complete Card',
      description: 'Sequentially send punches until the card is completed (rewardAchieved=true)',
      requiresLoyaltyProgram: true,
    },
  } as const;

  type ScenarioKey = keyof typeof scenarios;

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    if (selectedMerchantId) {
      fetchLoyaltyPrograms(selectedMerchantId);
    } else {
      setLoyaltyPrograms([]);
      setSelectedLoyaltyProgramId('');
    }
  }, [selectedMerchantId]);

  useEffect(() => {
    if (scenarioMerchantId) {
      fetchScenarioLoyaltyPrograms(scenarioMerchantId);
    } else {
      setScenarioLoyaltyPrograms([]);
      setScenarioLoyaltyProgramId('');
    }
  }, [scenarioMerchantId]);

  const fetchMerchants = async () => {
    try {
      const merchantData = await apiClient.getAllMerchants();
      setMerchants(merchantData);
    } catch (error: any) {
      console.error('Failed to fetch merchants:', error);
      setTestPunchStatus(`Error loading merchants: ${error.message}`);
    }
  };

  const fetchLoyaltyPrograms = async (merchantId: string) => {
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      setLoyaltyPrograms(programs);
      setSelectedLoyaltyProgramId('');
    } catch (error: any) {
      console.error('Failed to fetch loyalty programs:', error);
      setTestPunchStatus(`Error loading loyalty programs: ${error.message}`);
    }
  };

  const fetchScenarioLoyaltyPrograms = async (merchantId: string) => {
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      setScenarioLoyaltyPrograms(programs);
      setScenarioLoyaltyProgramId('');
    } catch (error: any) {
      console.error('Failed to fetch scenario loyalty programs:', error);
      setScenarioStatus(`Error loading loyalty programs: ${error.message}`);
    }
  };

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

  const handleDataOperation = async (operation: string, confirmMessage: string) => {
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    setApiStatus(`Performing ${operation}...`);
    try {
      let response;
      switch (operation) {
        case 'remove-punch-cards':
          response = await apiClient.removeAllPunchCards();
          break;
        case 'remove-users':
          response = await apiClient.removeAllUsers();
          break;
        case 'remove-loyalty-programs':
          response = await apiClient.removeAllLoyaltyPrograms();
          break;
        case 'remove-merchants':
          response = await apiClient.removeAllMerchants();
          break;
        case 'remove-all':
          response = await apiClient.removeAllData();
          break;
        default:
          throw new Error('Unknown operation');
      }
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

  const handlePunch = async () => {
    if (!userId) {
      setTestPunchStatus("Punch Error: No user ID available. Please set a user ID first.");
      return;
    }

    if (!selectedLoyaltyProgramId) {
      setTestPunchStatus("Punch Error: Please select a loyalty program.");
      return;
    }

    setLoading(true);
    setTestPunchStatus("Processing punch...");

    try {
      console.log(`Attempting punch for user: ${userId} on program: ${selectedLoyaltyProgramId}`);
      const result = await apiClient.recordPunch(userId, selectedLoyaltyProgramId);
      setTestPunchStatus(`Punch Success: Reward achieved: ${result.rewardAchieved}. Current punches: ${result.current_punches}/${result.required_punches}`);
    } catch (error: any) {
      console.error('Punch error:', error);
      setTestPunchStatus(`Punch Error: ${error.response?.data?.message || error.message || 'Failed to record punch.'}`);
    } finally {
      setLoading(false);
    }
  };

  const executeCompleteCardScenario = async () => {
    if (!userId) {
      setScenarioStatus("Error: No user ID available. Please set a user ID first.");
      return;
    }

    if (!scenarioLoyaltyProgramId) {
      setScenarioStatus("Error: Please select a loyalty program.");
      return;
    }

    setScenarioExecuting(true);
    setScenarioStatus("Starting Complete Card scenario...");

    try {
      let punchCount = 0;
      let rewardAchieved = false;
      let maxPunches = 50; // Safety limit to prevent infinite loops

      while (!rewardAchieved && punchCount < maxPunches) {
        punchCount++;
        setScenarioStatus(`Sending punch ${punchCount}...`);

        try {
          const result = await apiClient.recordPunch(userId, scenarioLoyaltyProgramId);
          rewardAchieved = result.rewardAchieved;
          
          setScenarioStatus(`Punch ${punchCount}: ${result.current_punches}/${result.required_punches} punches. Reward achieved: ${rewardAchieved}`);
          
          if (rewardAchieved) {
            setScenarioStatus(`✅ Scenario completed! Card completed after ${punchCount} punches. Final status: ${result.current_punches}/${result.required_punches}, Reward achieved: ${result.rewardAchieved}`);
            break;
          }

          // Wait 500ms before next punch
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          setScenarioStatus(`❌ Error on punch ${punchCount}: ${error.response?.data?.message || error.message}`);
          break;
        }
      }

      if (punchCount >= maxPunches && !rewardAchieved) {
        setScenarioStatus(`⚠️ Scenario stopped: Reached maximum punch limit (${maxPunches}) without completing card.`);
      }

    } catch (error: any) {
      setScenarioStatus(`❌ Scenario failed: ${error.message}`);
    } finally {
      setScenarioExecuting(false);
    }
  };

  const executeScenario = async () => {
    if (!selectedScenario) {
      setScenarioStatus("Error: Please select a scenario.");
      return;
    }

    switch (selectedScenario) {
      case 'complete-card':
        await executeCompleteCardScenario();
        break;
      default:
        setScenarioStatus(`Error: Unknown scenario "${selectedScenario}".`);
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

      <DevSection title="Merchant Testing" defaultExpanded={true}>
        <div style={styles.userInfo}>
          <p><strong>Current User ID:</strong> {userId || 'Not set'}</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            Punches will be recorded for the current user. Set a user ID above if needed.
          </p>
        </div>
        <div>
          <h3>Select Merchant and Loyalty Program</h3>
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ ...styles.inputField, width: '200px' }}
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a merchant...</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ ...styles.inputField, width: '300px' }}
              value={selectedLoyaltyProgramId}
              onChange={(e) => setSelectedLoyaltyProgramId(e.target.value)}
              disabled={loading || !selectedMerchantId}
            >
              <option value="">Select a loyalty program...</option>
              {loyaltyPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.requiredPunches} punches)
                </option>
              ))}
            </select>
          </div>
          <button 
            style={styles.button} 
            onClick={handlePunch}
            disabled={loading || !userId || !selectedLoyaltyProgramId}
          >
            Punch
          </button>
        </div>
        <div>
          <h4>Punch Result:</h4>
          <pre style={{
            ...styles.statusBox,
            color: testPunchStatus.startsWith('Punch Error:') ? 'red' : 
                   testPunchStatus.startsWith('Punch Success:') ? 'green' : 'black'
          }}>
            {testPunchStatus || 'No punch performed yet'}
          </pre>
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
      
      <DevSection title="API Testing">
        <div>
          <button 
            style={styles.button} 
            onClick={checkBackendConnection}
            disabled={loading}
          >
            Check Backend Connection
          </button>
        </div>
        <div>
          <h3>Response:</h3>
          <pre style={styles.statusBox}>
            {apiStatus}
          </pre>
        </div>
      </DevSection>

      <DevSection title="Data">
        <div style={styles.userInfo}>
          <p style={{ fontSize: '12px', color: '#d32f2f', margin: '5px 0' }}>
            ⚠️ Warning: These operations will permanently delete data and cannot be undone.
          </p>
        </div>
        <div>
          <button 
            style={{ ...styles.button, backgroundColor: '#d32f2f' }}
            onClick={() => handleDataOperation('remove-punch-cards', 'Are you sure you want to remove ALL punch cards? This action cannot be undone.')}
            disabled={loading}
          >
            Remove All Punch Cards
          </button>
          <button 
            style={{ ...styles.button, backgroundColor: '#d32f2f' }}
            onClick={() => handleDataOperation('remove-users', 'Are you sure you want to remove ALL users? This action cannot be undone.')}
            disabled={loading}
          >
            Remove All Users
          </button>
          <button 
            style={{ ...styles.button, backgroundColor: '#d32f2f' }}
            onClick={() => handleDataOperation('remove-loyalty-programs', 'Are you sure you want to remove ALL loyalty programs? This action cannot be undone.')}
            disabled={loading}
          >
            Remove All Loyalty Programs
          </button>
          <button 
            style={{ ...styles.button, backgroundColor: '#d32f2f' }}
            onClick={() => handleDataOperation('remove-merchants', 'Are you sure you want to remove ALL merchants? This action cannot be undone.')}
            disabled={loading}
          >
            Remove All Merchants
          </button>
          <button 
            style={{ ...styles.button, backgroundColor: '#8e0000' }}
            onClick={() => handleDataOperation('remove-all', 'Are you sure you want to remove ALL DATA from the database? This will delete everything and cannot be undone.')}
            disabled={loading}
          >
            Remove All Data
          </button>
        </div>
        <div>
          <h3>Operation Result:</h3>
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

      <DevSection title="Local Storage Debug">
        <div style={styles.userInfo}>
          <p><strong>Local Storage Items:</strong> {Object.keys(localStorage).length} items</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            View and manage all local storage data for debugging.
          </p>
        </div>
        <div>
          <button 
            style={styles.button} 
            onClick={() => {
              const keys = Object.keys(localStorage);
              keys.forEach(key => localStorage.removeItem(key));
              setApiStatus('All local storage items cleared');
            }}
            disabled={loading}
          >
            Clear All Local Storage
          </button>
          <button 
            style={styles.button} 
            onClick={() => {
              localStorage.setItem('test_item', JSON.stringify({ 
                message: 'Test data', 
                timestamp: new Date().toISOString() 
              }));
              setApiStatus('Test item added to local storage');
            }}
            disabled={loading}
          >
            Add Test Item
          </button>
        </div>
        <div>
          <h3>Local Storage Contents:</h3>
          <div style={{ 
            ...styles.statusBox, 
            maxHeight: '300px', 
            fontSize: '11px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6'
          }}>
            {Object.keys(localStorage).length === 0 ? (
              <div style={{ color: '#666' }}>Local storage is empty</div>
            ) : (
              Object.keys(localStorage).map((key) => {
                let value;
                let isJson = false;
                try {
                  const rawValue = localStorage.getItem(key);
                  JSON.parse(rawValue || '');
                  value = JSON.stringify(JSON.parse(rawValue || ''), null, 2);
                  isJson = true;
                } catch {
                  value = localStorage.getItem(key);
                }

                return (
                  <div key={key} style={{ 
                    marginBottom: '12px', 
                    padding: '8px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '4px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#495057',
                        fontSize: '12px'
                      }}>
                        🔑 {key}
                      </span>
                      <button
                        style={{
                          ...styles.button,
                          padding: '2px 6px',
                          fontSize: '10px',
                          backgroundColor: '#dc3545',
                          margin: 0
                        }}
                        onClick={() => {
                          localStorage.removeItem(key);
                          setApiStatus(`Removed "${key}" from local storage`);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#6c757d',
                      marginBottom: '4px'
                    }}>
                      Type: {isJson ? 'JSON' : 'String'} | Size: {(localStorage.getItem(key) || '').length} chars
                    </div>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: '10px', 
                      color: '#212529',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      backgroundColor: '#f8f9fa',
                      padding: '4px',
                      borderRadius: '2px',
                      maxHeight: '100px',
                      overflowY: 'auto'
                    }}>
                      {value}
                    </pre>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DevSection>

      <DevSection title="Scenario Testing">
        <div style={styles.userInfo}>
          <p><strong>Current User ID:</strong> {userId || 'Not set'}</p>
          <p><strong>Current Scenario:</strong> {selectedScenario ? scenarios[selectedScenario as ScenarioKey].name : 'Not selected'}</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            {selectedScenario ? scenarios[selectedScenario as ScenarioKey].description : 'Select a scenario to execute'}
          </p>
        </div>
        <div>
          <h3>Select Merchant and Loyalty Program</h3>
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ ...styles.inputField, width: '200px' }}
              value={scenarioMerchantId}
              onChange={(e) => setScenarioMerchantId(e.target.value)}
              disabled={scenarioExecuting}
            >
              <option value="">Select a merchant...</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ ...styles.inputField, width: '300px' }}
              value={scenarioLoyaltyProgramId}
              onChange={(e) => setScenarioLoyaltyProgramId(e.target.value)}
              disabled={scenarioExecuting || !scenarioMerchantId}
            >
              <option value="">Select a loyalty program...</option>
              {scenarioLoyaltyPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.requiredPunches} punches)
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h3>Select Scenario</h3>
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ ...styles.inputField, width: '300px' }}
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              disabled={scenarioExecuting}
            >
              <option value="">Select a scenario...</option>
              {Object.entries(scenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            style={styles.button} 
            onClick={executeScenario}
            disabled={scenarioExecuting || !selectedScenario || !userId || !scenarioLoyaltyProgramId}
          >
            {scenarioExecuting ? 'Executing...' : 'Execute Scenario'}
          </button>
        </div>
        <div>
          <h4>Scenario Result:</h4>
          <pre style={{
            ...styles.statusBox,
            color: scenarioStatus.startsWith('Error:') || scenarioStatus.startsWith('❌') ? 'red' : 
                   scenarioStatus.startsWith('✅') ? 'green' : 'black'
          }}>
            {scenarioStatus || 'No scenario executed yet'}
          </pre>
        </div>
      </DevSection>
    </div>
  );
};

export default DevPage; 
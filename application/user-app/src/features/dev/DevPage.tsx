import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { LOCAL_STORAGE_USER_ID_KEY, selectUserId, setUserId } from '../auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import { useWebSocket } from '../../hooks/useWebSocket';
import { webSocketClient } from '../../api/websocketClient';
import { useConsoleCapture, ConsoleMessage } from '../../hooks/useConsoleCapture';
import type { MerchantDto, LoyaltyProgramDto, PunchCardDto } from 'e-punch-common-core';


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
  const [redeemStatus, setRedeemStatus] = useState<string>('');
  const [merchants, setMerchants] = useState<MerchantDto[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
  
  // Card Redemption States
  const [userPunchCards, setUserPunchCards] = useState<PunchCardDto[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  
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
    'multi-program-test': {
      name: 'Multi-Program Test',
      description: 'Remove all cards, then add punches to two different loyalty programs with 2s delay',
      requiresLoyaltyProgram: false,
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
    const merchantToUse = selectedMerchantId || scenarioMerchantId;
    const merchantText = merchantToUse ? ` for merchant ${merchants.find(m => m.id === merchantToUse)?.name || merchantToUse}` : ' (all merchants)';
    setApiStatus(`Performing ${operation}${merchantText}...`);
    
    try {
      let response;
      switch (operation) {
        case 'remove-punch-cards':
          response = await apiClient.removeAllPunchCards(merchantToUse);
          break;
        case 'remove-users':
          response = await apiClient.removeAllUsers(merchantToUse);
          break;
        case 'remove-loyalty-programs':
          response = await apiClient.removeAllLoyaltyPrograms(merchantToUse);
          break;
        case 'remove-merchants':
          response = await apiClient.removeAllMerchants(merchantToUse);
          break;
        case 'remove-all':
          response = await apiClient.removeAllData(merchantToUse);
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
          await new Promise(resolve => setTimeout(resolve, 300));
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

  const executeMultiProgramTestScenario = async () => {
    if (!userId) {
      setScenarioStatus("Error: No user ID available. Please set a user ID first.");
      return;
    }

    if (!scenarioMerchantId) {
      setScenarioStatus("Error: Please select a merchant.");
      return;
    }

    setScenarioExecuting(true);
    setScenarioStatus("Starting Multi-Program Test scenario...");

    try {
      // Step 1: Remove all punch cards
      setScenarioStatus("Step 1: Removing all punch cards...");
      await apiClient.removeAllPunchCards(scenarioMerchantId);
      setScenarioStatus("✅ All punch cards removed successfully.");

      // Step 2: Get loyalty programs for the selected merchant
      setScenarioStatus("Step 2: Fetching loyalty programs for selected merchant...");
      const programs = await apiClient.getMerchantLoyaltyPrograms(scenarioMerchantId);
      
      if (programs.length < 2) {
        setScenarioStatus(`❌ Error: Selected merchant has only ${programs.length} loyalty program(s). Need at least 2 programs for this scenario.`);
        return;
      }

      const program1 = programs[0];
      const program2 = programs[1];
      setScenarioStatus(`Found programs: "${program1.name}" and "${program2.name}"`);

      // Step 3: Send punch to first loyalty program
      setScenarioStatus(`Step 3: Sending punch to "${program1.name}"...`);
      const result1 = await apiClient.recordPunch(userId, program1.id);
      setScenarioStatus(`✅ Punch recorded for "${program1.name}": ${result1.current_punches}/${result1.required_punches} punches`);

      // Step 4: Wait 2 seconds
      setScenarioStatus("Waiting 2 seconds...");
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 5: Send punch to second loyalty program
      setScenarioStatus(`Step 4: Sending punch to "${program2.name}"...`);
      const result2 = await apiClient.recordPunch(userId, program2.id);
      setScenarioStatus(`✅ Punch recorded for "${program2.name}": ${result2.current_punches}/${result2.required_punches} punches`);

      setScenarioStatus(`✅ Scenario completed! Successfully punched both programs:\n- ${program1.name}: ${result1.current_punches}/${result1.required_punches}\n- ${program2.name}: ${result2.current_punches}/${result2.required_punches}`);

    } catch (error: any) {
      setScenarioStatus(`❌ Scenario failed: ${error.response?.data?.message || error.message}`);
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
      case 'multi-program-test':
        await executeMultiProgramTestScenario();
        break;
      default:
        setScenarioStatus(`Error: Unknown scenario "${selectedScenario}".`);
    }
  };

  const fetchUserPunchCards = async () => {
    if (!userId) {
      setRedeemStatus("Error: No user ID available. Please set a user ID first.");
      return;
    }

    setLoadingCards(true);
    setRedeemStatus("Fetching punch cards...");

    try {
      const cards = await apiClient.getUserPunchCards(userId);
      setUserPunchCards(cards);
      setSelectedCardId('');
      setRedeemStatus(`Fetched ${cards.length} punch cards successfully.`);
    } catch (error: any) {
      console.error('Failed to fetch punch cards:', error);
      setRedeemStatus(`Error fetching cards: ${error.message || 'Unknown error'}`);
      setUserPunchCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleRedeemSelectedCard = async () => {
    if (!selectedCardId) {
      setRedeemStatus("Redeem Error: No card selected. Please select a punch card first.");
      return;
    }

    const selectedCard = userPunchCards.find(card => card.id === selectedCardId);
    if (!selectedCard) {
      setRedeemStatus("Redeem Error: Selected card not found.");
      return;
    }

    if (selectedCard.status !== 'REWARD_READY') {
      setRedeemStatus(`Redeem Error: Card is not ready for redemption. Current status: ${selectedCard.status}`);
      return;
    }

    setLoading(true);
    setRedeemStatus("Processing redemption...");

    try {
      console.log(`Attempting to redeem punch card: ${selectedCard.id}`);
      const redeemedCard = await apiClient.redeemPunchCard(selectedCard.id);
      
      // Update the local cards list
      setUserPunchCards(prev => 
        prev.map(card => card.id === redeemedCard.id ? redeemedCard : card)
      );
      
      setRedeemStatus(`Redeem Success: Card for ${redeemedCard.shopName} redeemed successfully! Status: ${redeemedCard.status}`);
    } catch (error: any) {
      console.error('Redeem error:', error);
      setRedeemStatus(`Redeem Error: ${error.response?.data?.message || error.message || 'Failed to redeem punch card.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch cards when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserPunchCards();
    } else {
      setUserPunchCards([]);
      setSelectedCardId('');
    }
  }, [userId]);

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
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            Selected merchant: {selectedMerchantId ? merchants.find(m => m.id === selectedMerchantId)?.name || 'Unknown' : 'All merchants (global operation)'}
          </p>
        </div>
        <div>
          <h3>Select Merchant (Optional)</h3>
          <div style={{ marginBottom: '15px' }}>
            <select 
              style={{ ...styles.inputField, width: '200px' }}
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              disabled={loading}
            >
              <option value="">All merchants (global operation)</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>
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
              disabled={
                scenarioExecuting || 
                !scenarioMerchantId || 
                (selectedScenario ? !scenarios[selectedScenario as ScenarioKey].requiresLoyaltyProgram : false)
              }
            >
              <option value="">
                {selectedScenario && !scenarios[selectedScenario as ScenarioKey].requiresLoyaltyProgram 
                  ? 'Not required for this scenario' 
                  : 'Select a loyalty program...'}
              </option>
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
            disabled={
              scenarioExecuting || 
              !selectedScenario || 
              !userId || 
              !scenarioMerchantId ||
              (selectedScenario ? scenarios[selectedScenario as ScenarioKey].requiresLoyaltyProgram && !scenarioLoyaltyProgramId : false)
            }
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

      <DevSection title="Card Redemption Testing" defaultExpanded={true}>
        <div style={styles.userInfo}>
          <p><strong>Current User ID:</strong> {userId || 'Not set'}</p>
          <p><strong>Total Punch Cards:</strong> {userPunchCards.length}</p>
          <p><strong>Reward Ready Cards:</strong> {userPunchCards.filter(card => card.status === 'REWARD_READY').length}</p>
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
            Cards are automatically fetched when user ID changes. Select a REWARD_READY card to redeem it.
          </p>
        </div>
        <div>
          <button 
            style={styles.button} 
            onClick={fetchUserPunchCards}
            disabled={loading || loadingCards || !userId}
          >
            {loadingCards ? 'Loading...' : 'Refresh Punch Cards'}
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>
          <h4>Select Card to Redeem:</h4>
          <select 
            style={{ ...styles.inputField, width: '400px' }}
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            disabled={loading || loadingCards || userPunchCards.length === 0}
          >
            <option value="">Select a punch card...</option>
            {userPunchCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.shopName} - {card.currentPunches}/{card.totalPunches} punches - {card.status}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button 
            style={{
              ...styles.button,
              backgroundColor: selectedCardId && userPunchCards.find(c => c.id === selectedCardId)?.status === 'REWARD_READY' ? '#4caf50' : '#9e9e9e',
              cursor: selectedCardId && userPunchCards.find(c => c.id === selectedCardId)?.status === 'REWARD_READY' ? 'pointer' : 'not-allowed'
            }}
            onClick={handleRedeemSelectedCard}
            disabled={loading || !selectedCardId || userPunchCards.find(c => c.id === selectedCardId)?.status !== 'REWARD_READY'}
          >
            {selectedCardId && userPunchCards.find(c => c.id === selectedCardId)?.status === 'REWARD_READY' ? 'Redeem Selected Card' : 'Select a Reward Ready Card'}
          </button>
          {selectedCardId && (
            <button 
              style={styles.button} 
              onClick={() => setSelectedCardId('')}
              disabled={loading}
            >
              Clear Selection
            </button>
          )}
        </div>
        <div>
          <h4>Redemption Status:</h4>
          <pre style={{
            ...styles.statusBox,
            color: redeemStatus.startsWith('Redeem Error:') || redeemStatus.startsWith('Error') ? 'red' : 
                   redeemStatus.startsWith('Redeem Success:') ? 'green' : 'black'
          }}>
            {redeemStatus || 'No operations performed yet'}
          </pre>
        </div>
        {selectedCardId && userPunchCards.find(c => c.id === selectedCardId) && (
          <div>
            <h4>Selected Card Details:</h4>
            <pre style={styles.statusBox}>
              {JSON.stringify(userPunchCards.find(c => c.id === selectedCardId), null, 2)}
            </pre>
          </div>
        )}
        {userPunchCards.length > 0 && (
          <div>
            <h4>All User Punch Cards:</h4>
            <div style={{ 
              ...styles.statusBox, 
              maxHeight: '200px',
              fontSize: '11px'
            }}>
              {userPunchCards.map((card) => (
                <div key={card.id} style={{
                  marginBottom: '8px',
                  padding: '6px',
                  backgroundColor: card.status === 'REWARD_READY' ? '#e8f5e8' : '#f5f5f5',
                  borderRadius: '3px',
                  borderLeft: `3px solid ${card.status === 'REWARD_READY' ? '#4caf50' : card.status === 'REWARD_REDEEMED' ? '#ff9800' : '#2196f3'}`
                }}>
                  <strong>{card.shopName}</strong> - {card.currentPunches}/{card.totalPunches} punches
                  <br />
                  <span style={{ fontSize: '10px', color: '#666' }}>
                    Status: {card.status} | ID: {card.id.substring(0, 8)}...
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DevSection>
    </div>
  );
};

export default DevPage; 
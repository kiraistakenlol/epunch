import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { LOCAL_STORAGE_USER_ID_KEY, selectUserId, setUserId } from '../auth/authSlice';
import { apiClient } from 'e-punch-common-ui';
import type { MerchantDto, LoyaltyProgramDto } from 'e-punch-common-core';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
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
    textAlign: 'center' as const,
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '15px',
    fontSize: '18px',
    color: '#333',
  },
  userInfo: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
  },
  inputField: {
    padding: '8px',
    marginRight: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '300px',
  },
  button: {
    backgroundColor: '#5d4037',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  executeButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  statusBox: {
    padding: '15px',
    backgroundColor: '#eee',
    borderRadius: '4px',
    marginTop: '15px',
    minHeight: '60px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre-wrap' as const,
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold' as const,
    color: '#333',
  },
};

const DevPage: React.FC = () => {
  const userId = useSelector((state: RootState) => selectUserId(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [customUserId, setCustomUserId] = useState<string>('412dbe6d-e933-464e-87e2-31fe9c9ee6ac');
  const [merchants, setMerchants] = useState<MerchantDto[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('');
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [selectedLoyaltyProgramId, setSelectedLoyaltyProgramId] = useState<string>('');
  const [scenarioStatus, setScenarioStatus] = useState<string>('');
  const [scenarioExecuting, setScenarioExecuting] = useState<boolean>(false);

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

  const fetchMerchants = async () => {
    try {
      const merchantData = await apiClient.getAllMerchants();
      setMerchants(merchantData);
    } catch (error: any) {
      console.error('Failed to fetch merchants:', error);
      setScenarioStatus(`Error loading merchants: ${error.message}`);
    }
  };

  const fetchLoyaltyPrograms = async (merchantId: string) => {
    try {
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchantId);
      setLoyaltyPrograms(programs);
      setSelectedLoyaltyProgramId('');
    } catch (error: any) {
      console.error('Failed to fetch loyalty programs:', error);
      setScenarioStatus(`Error loading loyalty programs: ${error.message}`);
    }
  };

  const handleSetCustomUserId = () => {
    if (customUserId.trim() === '') {
      setScenarioStatus('Custom User ID cannot be empty.');
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, customUserId);
    dispatch(setUserId(customUserId));
    setScenarioStatus(`User ID set to "${customUserId}"`);
  };

  const executeCompleteCardScenario = async () => {
    if (!userId) {
      setScenarioStatus("Error: No user ID available. Please set a user ID first.");
      return;
    }

    if (!selectedLoyaltyProgramId) {
      setScenarioStatus("Error: Please select a loyalty program.");
      return;
    }

    setScenarioExecuting(true);
    setScenarioStatus("Starting Complete Card scenario...");

    try {
      let punchCount = 0;
      let rewardAchieved = false;
      let maxPunches = 50;

      while (!rewardAchieved && punchCount < maxPunches) {
        punchCount++;
        setScenarioStatus(`Sending punch ${punchCount}...`);

        try {
          const result = await apiClient.recordPunch(userId, selectedLoyaltyProgramId);
          rewardAchieved = result.rewardAchieved;
          
          setScenarioStatus(`Punch ${punchCount}: ${result.current_punches}/${result.required_punches} punches. Reward achieved: ${rewardAchieved}`);
          
          if (rewardAchieved) {
            setScenarioStatus(`✅ Scenario completed! Card completed after ${punchCount} punches. Final status: ${result.current_punches}/${result.required_punches}, Reward achieved: ${result.rewardAchieved}`);
            break;
          }

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

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>E-PUNCH.io - Card Completion Test</h1>
      </header>

      <section style={styles.section}>
        <button 
          style={styles.button} 
          onClick={() => navigate('/')}
        >
          ← Back to Dashboard
        </button>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>User Setup</h2>
        <div style={styles.userInfo}>
          <strong>Current User ID:</strong> {userId || 'Not set'}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Set Test User ID:</label>
          <input 
            type="text"
            style={styles.inputField}
            value={customUserId}
            onChange={(e) => setCustomUserId(e.target.value)}
            placeholder="Enter User ID for testing"
          />
          <button 
            style={styles.button} 
            onClick={handleSetCustomUserId}
            disabled={scenarioExecuting}
          >
            Set User ID
          </button>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Card Completion Test</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Merchant:</label>
          <select 
            style={styles.inputField}
            value={selectedMerchantId}
            onChange={(e) => setSelectedMerchantId(e.target.value)}
            disabled={scenarioExecuting}
          >
            <option value="">Choose a merchant...</option>
            {merchants.map((merchant) => (
              <option key={merchant.id} value={merchant.id}>
                {merchant.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Select Loyalty Program:</label>
          <select 
            style={styles.inputField}
            value={selectedLoyaltyProgramId}
            onChange={(e) => setSelectedLoyaltyProgramId(e.target.value)}
            disabled={scenarioExecuting || !selectedMerchantId}
          >
            <option value="">Choose a loyalty program...</option>
            {loyaltyPrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} ({program.requiredPunches} punches required)
              </option>
            ))}
          </select>
        </div>

        <button 
          style={{
            ...styles.executeButton,
            backgroundColor: scenarioExecuting ? '#999' : '#4caf50',
            cursor: scenarioExecuting ? 'not-allowed' : 'pointer',
          }}
          onClick={executeCompleteCardScenario}
          disabled={
            scenarioExecuting || 
            !userId || 
            !selectedMerchantId ||
            !selectedLoyaltyProgramId
          }
        >
          {scenarioExecuting ? 'Running Test...' : 'Execute Card Completion Test'}
        </button>

        <div style={{
          ...styles.statusBox,
          color: scenarioStatus.startsWith('Error:') || scenarioStatus.startsWith('❌') ? 'red' : 
                 scenarioStatus.startsWith('✅') ? 'green' : 'black'
        }}>
          {scenarioStatus || 'Select merchant and loyalty program, then click "Execute Card Completion Test" to start the automated punch sequence.'}
        </div>
      </section>
    </div>
  );
};

export default DevPage; 
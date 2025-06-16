import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import { 
  EpunchPage, 
  EpunchVerticalStack,
  EpunchFlexRow,
  EpunchButton,
  LoyaltyProgramsList
} from '../../components/foundational';

export const LoyaltyPrograms: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    navigate('/loyalty-programs/create');
  };

  return (
    <EpunchPage 
      title="Loyalty Programs" 
      error={error}
    >
      <EpunchVerticalStack>
        <EpunchFlexRow justify="end">
          <EpunchButton
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Program
          </EpunchButton>
        </EpunchFlexRow>
        
        <EpunchFlexRow>
          <LoyaltyProgramsList onError={setError} />
        </EpunchFlexRow>
      </EpunchVerticalStack>
    </EpunchPage>
  );
}; 
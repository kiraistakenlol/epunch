import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LoyaltyProgramDto } from 'e-punch-common-core';
import { 
  EpunchCard, 
  EpunchTypography, 
  EpunchBox, 
  EpunchIconButton,
  EpunchFlexRow
} from '../../components/foundational';

interface LoyaltyProgramListItemProps {
  program: LoyaltyProgramDto;
  onDelete: (id: string, name: string) => void;
}

const StatusIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <EpunchTypography 
    variant="caption" 
    color={isActive ? 'primary' : 'disabled'}
    bold
  >
    {isActive ? '● Active' : '○ Inactive'}
  </EpunchTypography>
);

export const LoyaltyProgramListItem: React.FC<LoyaltyProgramListItemProps> = ({ 
  program, 
  onDelete 
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/loyalty-programs/${program.id}/edit`);
  };

  const handleDelete = () => {
    onDelete(program.id, program.name);
  };

  return (
    <EpunchCard>
      <EpunchFlexRow justify="space-between" align="start">
        <EpunchBox>
          <EpunchFlexRow align="center" gap={8}>
            <EpunchTypography variant="cardTitle" color="primary">
              {program.name}
            </EpunchTypography>
            <StatusIndicator isActive={program.isActive} />
          </EpunchFlexRow>
          
          <EpunchTypography variant="body" color="secondary" bold>
            {program.requiredPunches} punches → {program.rewardDescription}
          </EpunchTypography>

          {program.description && (
            <EpunchTypography variant="caption" color="secondary">
              {program.description}
            </EpunchTypography>
          )}
        </EpunchBox>
        
        <EpunchFlexRow gap={8}>
          <EpunchIconButton
            onClick={handleEdit}
            variant="primary"
            size="small"
          >
            <EditIcon fontSize="small" />
          </EpunchIconButton>
          
          <EpunchIconButton
            onClick={handleDelete}
            variant="secondary"
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </EpunchIconButton>
        </EpunchFlexRow>
      </EpunchFlexRow>
    </EpunchCard>
  );
}; 
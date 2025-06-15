import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { SVGPropertyEditor } from './SVGPropertyEditor';
import { SVGProperties, IconType, IconState } from './';

interface IconCustomizationPanelProps {
  activeIconType: IconType;
  activeIconState: IconState;
  canSave: boolean;
  onPropertiesChange: (properties: SVGProperties) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const IconCustomizationPanel: React.FC<IconCustomizationPanelProps> = ({
  activeIconType,
  activeIconState,
  canSave,
  onPropertiesChange,
  onSave,
  isSaving = false,
}) => {
  const getTitle = () => {
    return activeIconType === 'filled' ? 'Filled' : 'Unfilled';
  };

  const getDescription = () => {
    if (!activeIconState.icon) {
      return `Select an icon from the grid to customize the ${activeIconType} state`;
    }
    return `Customizing "${activeIconState.icon.name}" for ${activeIconType} state`;
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 1 }}>
            Customize {getTitle()} Icon
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            {getDescription()}
          </Typography>
          
          {activeIconState.icon ? (
            <SVGPropertyEditor
              properties={activeIconState.properties}
              onPropertiesChange={onPropertiesChange}
              selectedLibrary="react"
            />
          ) : (
            <Box
              sx={{
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                color: '#666',
                p: 3,
              }}
            >
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                👈 Select an icon from the grid
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: '200px' }}>
                Click on any icon in the "Available Icons" section to start customizing it
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!canSave || isSaving}
        onClick={onSave}
        sx={{
          backgroundColor: '#5d4037',
          color: 'white',
          fontWeight: 'bold',
          py: 1.5,
          '&:hover': {
            backgroundColor: '#3e2723',
          },
          '&:disabled': {
            backgroundColor: '#ccc',
            color: '#999',
          },
        }}
      >
        {isSaving ? 'Saving...' : canSave ? 'Save Punch Card Icons' : 'Select Both Icons to Save'}
      </Button>
    </Box>
  );
}; 
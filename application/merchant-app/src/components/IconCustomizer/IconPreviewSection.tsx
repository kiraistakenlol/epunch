import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import SvgIcon from './SvgIcon';
import { IconType, IconState } from './';

interface IconPreviewSectionProps {
  iconStates: Record<IconType, IconState>;
}

export const IconPreviewSection: React.FC<IconPreviewSectionProps> = ({
  iconStates,
}) => {
  const renderPunchIcon = (type: IconType, index: number) => {
    const iconState = iconStates[type];
    
    return (
      <Box
        key={`${type}-${index}`}
        sx={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          backgroundColor: 'transparent',
        }}
      >
        {iconState.icon ? (
          <SvgIcon
            icon={iconState.icon}
            size={iconState.properties.size * 0.7}
            color={iconState.properties.color}
            opacity={iconState.properties.opacity}
            rotation={iconState.properties.rotation}
            scaleX={iconState.properties.scaleX}
            scaleY={iconState.properties.scaleY}
          />
        ) : (
          <Box
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '20px',
            }}
          >
            ?
          </Box>
        )}
      </Box>
    );
  };

  const createPunchCardPattern = () => {
    const pattern = [];
    // [x] [x] [x] [ ] [ ]
    // [ ] [ ] [ ] [ ] [ ]
    const filledPositions = [0, 1, 2];
    
    for (let row = 0; row < 2; row++) {
      const rowIcons = [];
      for (let col = 0; col < 5; col++) {
        const index = row * 5 + col;
        const iconType: IconType = filledPositions.includes(index) ? 'filled' : 'unfilled';
        rowIcons.push(renderPunchIcon(iconType, index));
      }
      pattern.push(
        <Box key={row} sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {rowIcons}
        </Box>
      );
    }
    return pattern;
  };

  return (
    <Card sx={{ mb: 3, backgroundColor: '#fff' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          Punch Card Preview
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
          This shows how your punch card will look with both filled and unfilled states.
        </Typography>

        <Box
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            border: '2px solid #e0e0e0',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'center',
          }}
        >
          {createPunchCardPattern()}
        </Box>
      </CardContent>
    </Card>
  );
}; 
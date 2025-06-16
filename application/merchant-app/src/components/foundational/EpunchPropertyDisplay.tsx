import React from 'react';
import { Box } from '@mui/material';
import { EpunchTypography } from './EpunchTypography';
import { colors } from '../../theme/constants';

export interface PropertyDisplayItem {
  label: string;
  value: string | React.ReactNode;
  fullWidth?: boolean;
}

export interface EpunchPropertyDisplayProps {
  /** Array of properties to display */
  properties: PropertyDisplayItem[];
  /** Number of columns in grid layout */
  columns?: 1 | 2 | 3;
  /** Spacing between items */
  spacing?: 'small' | 'medium' | 'large';
  /** Whether to show dividers between sections */
  showDividers?: boolean;
}

const spacingMap = {
  small: 1,
  medium: 2,
  large: 3
};

export const EpunchPropertyDisplay: React.FC<EpunchPropertyDisplayProps> = ({
  properties,
  columns = 2,
  spacing = 'medium',
  showDividers = false
}) => {
  const spacingValue = spacingMap[spacing];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns === 1 ? '1fr' : columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: spacingValue,
        ...(showDividers && {
          '& > *:not(:last-child)': {
            borderBottom: `1px solid ${colors.border.divider}`,
            pb: spacingValue
          }
        })
      }}
    >
      {properties.map((property, index) => (
        <Box
          key={index}
          sx={{
            ...(property.fullWidth && {
              gridColumn: '1 / -1'
            })
          }}
        >
          <EpunchTypography
            variant="label"
            color="secondary"
          >
            {property.label}
          </EpunchTypography>
          {typeof property.value === 'string' ? (
            <EpunchTypography variant="body" color="primary">
              {property.value}
            </EpunchTypography>
          ) : (
            property.value
          )}
        </Box>
      ))}
    </Box>
  );
}; 
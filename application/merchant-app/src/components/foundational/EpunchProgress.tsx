import React from 'react';
import { CircularProgress, LinearProgress, CircularProgressProps, LinearProgressProps } from '@mui/material';

type ProgressVariant = 'circular' | 'linear';
type ProgressSize = 'small' | 'medium' | 'large';
type ProgressColor = 'primary' | 'secondary' | 'inherit' | 'white';

interface EpunchProgressProps {
  variant?: ProgressVariant;
  size?: ProgressSize;
  color?: ProgressColor;
  value?: number;
  determinate?: boolean;
  thickness?: number;
}

const EpunchProgress: React.FC<EpunchProgressProps> = ({
  variant = 'circular',
  size = 'medium',
  color = 'primary',
  value,
  determinate = false,
  thickness = 3.6,
  ...props
}) => {
  const getSizeValue = (): number => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 40;
      default: return 24;
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return { color: '#5d4037' };
      case 'secondary':
        return { color: '#795548' };
      case 'white':
        return { color: '#f5f5dc' };
      case 'inherit':
      default:
        return { color: 'inherit' };
    }
  };

  if (variant === 'linear') {
    const linearProps: LinearProgressProps = {
      variant: determinate ? 'determinate' : 'indeterminate',
      value: determinate ? value : undefined,
      sx: {
        height: thickness,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        '& .MuiLinearProgress-bar': getColorStyle(),
        border: '1px solid rgba(0, 0, 0, 0.1)',
      },
      ...props
    };
    return <LinearProgress {...linearProps} />;
  }

  const circularProps: CircularProgressProps = {
    variant: determinate ? 'determinate' : 'indeterminate',
    value: determinate ? value : undefined,
    size: getSizeValue(),
    thickness,
    sx: {
      ...getColorStyle(),
      border: '1px solid rgba(0, 0, 0, 0.1)',
    },
    ...props
  };

  return <CircularProgress {...circularProps} />;
};

export default EpunchProgress; 
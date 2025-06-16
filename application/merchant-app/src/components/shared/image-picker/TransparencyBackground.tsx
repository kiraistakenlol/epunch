import { Box, BoxProps } from '@mui/material';

interface TransparencyBackgroundProps extends Omit<BoxProps, 'sx'> {
  checkSize?: number;
  lightColor?: string;
  darkColor?: string;
  sx?: BoxProps['sx'];
}

export const TransparencyBackground: React.FC<TransparencyBackgroundProps> = ({
  checkSize = 20,
  lightColor = '#ffffff',
  darkColor = '#cccccc',
  sx,
  children,
  ...boxProps
}) => {
  return (
    <Box
      {...boxProps}
      sx={{
        backgroundImage: `
          linear-gradient(45deg, ${darkColor} 25%, transparent 25%),
          linear-gradient(-45deg, ${darkColor} 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, ${darkColor} 75%),
          linear-gradient(-45deg, transparent 75%, ${darkColor} 75%)
        `,
        backgroundColor: lightColor,
        backgroundSize: `${checkSize}px ${checkSize}px`,
        ...sx
      }}
    >
      {children}
    </Box>
  );
}; 
export const colors = {
  // Primary brand colors
  primary: '#5d4037',
  primaryLight: '#8d6e63', 
  primaryDark: '#4a3e37',
  
  // Secondary colors
  secondary: '#795548',
  secondaryLight: '#a1887f',
  secondaryDark: '#6d4c41',
  
  // Background colors
  background: {
    default: '#424242',
    paper: '#f5f5dc',
    card: '#8d6e63',
    preview: '#f5f5f5',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text colors
  text: {
    primary: '#2e1501',
    secondary: '#3e2723', 
    light: '#f5f5dc',
    accent: '#fff8dc',
    disabled: '#666',
  },
  
  // State colors
  success: {
    main: '#4caf50',
    dark: '#45a049',
    light: '#66bb6a',
  },
  
  error: {
    main: '#f44336',
    dark: '#d32f2f',
    light: '#ff5722',
  },
  
  warning: {
    main: '#ff9800',
    light: '#ffd93d',
  },
  
  info: {
    main: '#2196f3',
    slate: '#2c3e50',
  },
  
  // Special colors
  reward: {
    ready: '#44e62f',
    selected: '#ffd700',
    glow: 'greenyellow',
    selectedBg: 'rgba(255, 215, 0, 0.5)',
    selectedBgHover: 'rgba(255, 215, 0, 0.3)',
    selectedBorder: 'rgba(255, 215, 0, 0.5)',
    readyBg: 'rgba(68, 230, 47, 0.2)',
    readyBgHover: 'rgba(68, 230, 47, 0.3)',
    readyBorder: 'rgba(68, 230, 47, 0.5)',
  },
  
  // Interactive states
  hover: {
    primary: '#6d4c41',
    background: 'rgba(245, 245, 220, 0.1)',
  },

  // Button colors
  button: {
    google: '#4285f4',
    googleHover: '#3367d6',
    orange: '#ff9500',
    orangeHover: '#e6850e',
    danger: '#d32f2f',
    dangerHover: '#b71c1c',
    darkRed: '#8e0000',
    cancel: '#f5f5f5',
    cancelHover: '#e0e0e0',
  },

  // Modal and form colors
  modal: {
    background: '#5d4037',
    text: '#f5f5dc',
    border: '#ddd',
    errorBg: '#fee',
    errorText: '#c33',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Shadows and effects
  shadow: {
    light: 'rgba(93, 64, 55, 0.3)',
    medium: 'rgba(76, 175, 80, 0.6)',
    heavy: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    border: 'rgba(0, 0, 0, 0.1)',
    textAccent: 'rgba(255, 248, 220, 0.3)',
  },
} as const;

export const zIndex = {
  modal: 1300,
  overlay: 1200,
  dropdown: 1100,
  header: 1000,
  card: 10,
  content: 1,
} as const; 
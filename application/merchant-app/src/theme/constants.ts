export const colors = {
  primary: '#5d4037',
  primaryLight: '#8d6e63',
  primaryDark: '#3e2723',
  secondary: '#795548',
  secondaryLight: '#a1887f',
  secondaryDark: '#4e342e',
  background: {
    default: '#424242',
    paper: '#f5f5dc',
    variant: '#f8f8f8',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#3e2723',
    secondary: '#5d4037',
    light: '#f5f5dc',
    disabled: '#666',
  },
  success: '#4caf50',
  successBackground: 'rgba(76, 175, 80, 0.1)',
  successBorder: 'rgba(76, 175, 80, 0.3)',
  successDark: '#2e7d32',
  successLight: '#66bb6a',
  error: '#d32f2f',
  errorBackground: 'rgba(211, 47, 47, 0.5)',
  errorDark: '#c62828',
  errorLight: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  border: {
    default: '#e0e0e0',
    divider: '#d7ccc8',
    focus: '#5d4037',
    input: '#8d6e63',
  },
  hover: {
    primary: '#6d4c41',
    secondary: '#a1887f',
    background: 'rgba(245, 245, 220, 0.1)',
    selected: 'rgba(245, 245, 220, 0.2)',
    selectedActive: 'rgba(245, 245, 220, 0.3)',
    button: '#6d4c41',
  },
  state: {
    disabled: '#757575',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
  xlarge: '16px',
} as const;

export const shadows = {
  none: 'none',
  light: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
  heavy: '0 4px 10px rgba(0, 0, 0, 0.3)',
  text: '1px 1px 1px #3e2723',
} as const;

export const typography = {
  fontFamily: '-apple-modal, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  fontSize: {
    mobile: {
      h4: '1.75rem',
      h6: '1.1rem',
      h1: '1.4em',
      body: '0.9rem',
      body2: '0.875rem',
      caption: '0.75rem',
    },
    desktop: {
      h4: '2.125rem',
      h6: '1.25rem',
      h1: '1.8em',
      body: '1rem',
      body2: '0.875rem',
      caption: '0.75rem',
    },
    css: {
      large: '1.5em',
      medium: '1.3em',
      small: '1.1em',
      xsmall: '0.9em',
    },
  },
  fontWeight: {
    normal: 'normal',
    medium: 500,
    bold: 'bold',
    600: 600,
  },
} as const;

export const layout = {
  drawerWidth: 280,
  appBarHeight: {
    mobile: 60,
    desktop: 70,
  },
  maxContentWidth: 1200,
  cardHeight: {
    mobile: 'auto',
    desktop: '200px',
  },
  minHeight: {
    loading: '200px',
    fullScreen: 'calc(100vh - 120px)',
    fullViewport: '100vh',
  },
} as const;

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export const animation = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

export const gradients = {
  cardBackground: 'linear-gradient(135deg, #f5f5dc 0%, #efebe9 100%)',
} as const;

// Component variants discovered during audit
export const variants = {
  button: {
    primary: {
      backgroundColor: colors.primaryDark,
      color: colors.text.light,
      '&:hover': { backgroundColor: colors.primary },
    },
    secondary: {
      backgroundColor: colors.background.paper,
      color: colors.text.primary,
    },
    outlined: {
      backgroundColor: 'transparent',
      color: colors.primary,
      border: `1px solid ${colors.border.default}`,
    },
    text: {
      backgroundColor: 'transparent',
      color: colors.primary,
    },
  },
  input: {
    default: {
      backgroundColor: '#fff',
      borderColor: colors.border.input,
      '&:hover': { borderColor: colors.primary },
      '&:focus': { borderColor: colors.primary },
    },
    error: {
      borderColor: colors.error,
      '&:hover': { borderColor: colors.error },
      '&:focus': { borderColor: colors.error },
    },
  },
  card: {
    default: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.medium,
      boxShadow: shadows.light,
    },
    elevated: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.large,
      boxShadow: shadows.heavy,
    },
    form: {
      backgroundColor: colors.background.paper,
      borderRadius: borderRadius.medium,
      boxShadow: shadows.light,
    },
  },
} as const; 
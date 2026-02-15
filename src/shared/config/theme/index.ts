/**
 * Professional Theme System for Islamic Inheritance Calculator
 * Expert-level design with Islamic-inspired aesthetics
 */

export const colors = {
  // Primary Palette - Islamic Green & Gold
  primary: {
    main: '#1B5E20',      // Deep Islamic Green
    light: '#4CAF50',     // Light Green
    dark: '#0D3310',      // Dark Green
    contrast: '#FFFFFF',
  },
  
  // Secondary Palette - Royal Gold
  secondary: {
    main: '#C9A227',      // Islamic Gold
    light: '#F4D03F',     // Light Gold
    dark: '#9A7B1A',      // Dark Gold
    contrast: '#1A1A1A',
  },
  
  // Accent Colors
  accent: {
    teal: '#00897B',      // Teal for special cases
    purple: '#7B1FA2',    // Purple for madhab distinction
    blue: '#1565C0',      // Blue for info
    orange: '#E65100',    // Orange for warnings
  },
  
  // Madhab Colors - Distinctive for each school
  madhab: {
    shafii: '#2E7D32',    // Green
    hanafi: '#C62828',    // Red
    maliki: '#6A1B9A',    // Purple
    hanbali: '#1565C0',   // Blue
  },
  
  // Background Colors
  background: {
    main: '#F5F5DC',      // Beige (Islamic parchment)
    dark: '#1A1A2E',      // Dark navy
    card: '#FFFFFF',
    elevated: '#FAFAFA',
    gradient: ['#F5F5DC', '#E8E4C9'], // Parchment gradient
  },
  
  // Text Colors
  text: {
    primary: '#1A1A1A',
    secondary: '#5D5D5D',
    muted: '#8B8B8B',
    inverse: '#FFFFFF',
    arabic: '#1B5E20',    // Green for Arabic text
  },
  
  // Status Colors
  status: {
    success: '#2E7D32',
    warning: '#F9A825',
    error: '#C62828',
    info: '#1565C0',
  },
  
  // Share Type Colors
  share: {
    fard: '#1565C0',      // Blue for prescribed
    asaba: '#2E7D32',     // Green for residuary
    radd: '#F9A825',      // Amber for return
    blood: '#7B1FA2',     // Purple for blood relatives
    blocked: '#C62828',   // Red for blocked
  },
  
  // Border & Divider
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  
  // Shadows
  shadow: {
    light: 'rgba(0,0,0,0.05)',
    medium: 'rgba(0,0,0,0.1)',
    dark: 'rgba(0,0,0,0.2)',
  },
};

// Typography Scale
export const typography = {
  // Font Families
  fonts: {
    arabic: 'Cairo',
    primary: 'Roboto',
    secondary: 'OpenSans',
  },
  
  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },
  
  // Font Weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing Scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 16,
  },
};

// Animation Timing
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: 320,
  md: 375,
  lg: 414,
  xl: 768,
};

// Complete Theme Object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  zIndex,
  breakpoints,
};

export default theme;

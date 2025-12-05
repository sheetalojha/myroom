/**
 * LittleWorlds Design System Theme
 * Centralized theme configuration for consistent UI across the app
 */

export const theme = {
  // Color Palette - Matching brand gradients
  colors: {
    // Primary brand colors (baby powder palette)
    primary: {
      50: '#fff8f5',
      100: '#f5f5f0',
      200: '#e8e8e5',
      300: '#d8d8d5',
      400: '#c8c8c5',
      500: '#6b5d6b', // Main brand color
      600: '#5a4d5a',
      700: '#4a3d4a',
    },
    
    // Pink + Baby powder gradient colors (no purple)
    gradient: {
      start: '#ffb3d9', // Soft pink
      middle: '#fff8f5', // Baby powder cream
      end: '#f5f5f0', // Light baby powder
    },
    
    // Darker gradient variant for text visibility
    gradientDark: {
      start: '#ff6b9d', // Darker pink
      middle: '#ffb3d9', // Medium pink
      end: '#ff6b9d', // Darker pink
    },
    
    // Secondary purplish gradient variant (for future use)
    gradientPurple: {
      start: '#b894f5', // Soft purple
      middle: '#d4c4f0', // Light purple
      end: '#e8dff5', // Very light purple
    },
    
    // Neutral grays
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e8e8e8',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Semantic colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Background colors
    background: {
      primary: '#fff8f5',
      secondary: '#f0e8ff',
      tertiary: '#ffffff',
      overlay: 'rgba(255, 255, 255, 0.95)',
      overlayDark: 'rgba(26, 32, 44, 0.8)',
    },
    
    // Text colors
    text: {
      primary: '#1A202C',
      secondary: '#6B7280',
      tertiary: '#8b7d8b',
      inverse: '#ffffff',
      disabled: '#a3a3a3',
    },
    
    // Border colors
    border: {
      light: 'rgba(255, 255, 255, 0.3)',
      medium: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.2)',
    },
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", monospace',
    },
    
    fontSize: {
      xs: '10px',
      sm: '11px',
      base: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '32px',
      '5xl': '48px',
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    letterSpacing: {
      tighter: '-0.02em',
      tight: '-0.01em',
      normal: '0',
      wide: '0.01em',
    },
  },
  
  // Spacing System (4px base unit)
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },
  
  // Border styles for cards (double border design)
  borders: {
    cardOuter: '1px solid rgba(0, 0, 0, 0.12)', // Outer thin grayish border
    cardInner: '1px solid rgba(0, 0, 0, 0.12)', // Inner thin grayish border
    cardGap: '4px', // Gap between outer and inner borders
    cardFill: 'rgba(255, 255, 255, 0.5)', // Mild color fill between borders
    cardHoverOuter: '1px solid rgba(0, 0, 0, 0.18)', // Darker on hover
    cardHoverInner: '1px solid rgba(0, 0, 0, 0.18)',
  },
  
  // Shadows (Elevation levels) - No shadows
  shadows: {
    sm: 'none',
    md: 'none',
    lg: 'none',
    xl: 'none',
    inner: 'none',
  },
  
  // Backdrop Blur
  backdropBlur: {
    sm: '8px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  
  // Transitions & Animations
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Helper function to get theme value
export const getThemeValue = (path) => {
  const keys = path.split('.');
  let value = theme;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }
  return value;
};

// CSS Variables for use in stylesheets
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary-50: ${theme.colors.primary[50]};
    --color-primary-100: ${theme.colors.primary[100]};
    --color-primary-200: ${theme.colors.primary[200]};
    --color-primary-300: ${theme.colors.primary[300]};
    --color-primary-400: ${theme.colors.primary[400]};
    --color-primary-500: ${theme.colors.primary[500]};
    
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-text-tertiary: ${theme.colors.text.tertiary};
    
    --color-background-primary: ${theme.colors.background.primary};
    --color-background-secondary: ${theme.colors.background.secondary};
    --color-background-overlay: ${theme.colors.background.overlay};
    
    --color-border-light: ${theme.colors.border.light};
    --color-border-medium: ${theme.colors.border.medium};
    
    /* Spacing */
    --spacing-1: ${theme.spacing[1]};
    --spacing-2: ${theme.spacing[2]};
    --spacing-3: ${theme.spacing[3]};
    --spacing-4: ${theme.spacing[4]};
    --spacing-6: ${theme.spacing[6]};
    --spacing-8: ${theme.spacing[8]};
    
    /* Border Radius */
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    --radius-2xl: ${theme.borderRadius['2xl']};
    --radius-full: ${theme.borderRadius.full};
    
    /* Shadows */
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
    
    /* Transitions */
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
    --transition-slow: ${theme.transitions.slow};
    
    /* Font */
    --font-family-primary: ${theme.typography.fontFamily.primary};
    --font-size-base: ${theme.typography.fontSize.base};
  }
`;

export default theme;


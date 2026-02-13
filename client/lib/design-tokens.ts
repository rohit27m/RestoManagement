// Design Tokens - Premium SaaS Design System
// Strict minimalism: Black, White, Green, Red only

export const tokens = {
  colors: {
    // Dark Theme
    dark: {
      bg: '#0b0b0b',
      surface: '#111111',
      surfaceElevated: '#161616',
      border: '#222222',
      borderSubtle: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#a3a3a3',
      textTertiary: '#737373',
    },
    // Light Theme
    light: {
      bg: '#ffffff',
      surface: '#f6f6f6',
      surfaceElevated: '#ffffff',
      border: '#e5e5e5',
      borderSubtle: '#f0f0f0',
      text: '#0a0a0a',
      textSecondary: '#525252',
      textTertiary: '#a3a3a3',
    },
    // Semantic Colors (theme-agnostic)
    success: '#10b981', // Emerald green
    successHover: '#059669',
    successLight: '#d1fae5',
    danger: '#ef4444', // Muted red
    dangerHover: '#dc2626',
    dangerLight: '#fee2e2',
    white: '#ffffff',
    black: '#000000',
  },

  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },

  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// Framer Motion Variants
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
} as const;

export const motionConfig = {
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  normal: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  slow: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
} as const;

/**
 * Design Tokens & Theme System
 * ============================
 * Merkezi tasarım sistemi - Tüm renk, tipografi, spacing ve
 * shadow değerleri burada tanımlı. Single source of truth.
 * 
 * @author Oleksandr - Senior UI/UX Designer
 * @version 2.0.0
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================
// Modern, erişilebilir ve profesyonel renk paleti
// WCAG 2.1 AA standartlarına uygun kontrastlar

export const colors = {
  // Primary - Ana marka rengi (Indigo tonları)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',  // Ana renk
    600: '#4F46E5',  // Hover
    700: '#4338CA',  // Active/Pressed
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  
  // Neutral - Gri tonları (Slate bazlı)
  neutral: {
    0: '#FFFFFF',
    25: '#FCFCFD',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic Colors - Durumlar için
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // Ana
    600: '#059669',  // Hover
    700: '#047857',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Ana
    600: '#D97706',  // Hover
    700: '#B45309',
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',  // Ana
    600: '#DC2626',  // Hover
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Ana
    600: '#2563EB',  // Hover
    700: '#1D4ED8',
  },

  // Accent Colors - Vurgu renkleri
  accent: {
    teal: '#14B8A6',
    cyan: '#06B6D4',
    violet: '#8B5CF6',
    pink: '#EC4899',
    orange: '#F97316',
  },
} as const;

// ============================================================================
// CSS CLASS MAPPINGS
// ============================================================================
// Tailwind utility sınıfları için merkezi mapping

export const themeClasses = {
  // Button Variants
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variant: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500 shadow-sm hover:shadow-md',
      secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 focus-visible:ring-neutral-400 border border-neutral-200',
      outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
      ghost: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-400',
      danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus-visible:ring-danger-500 shadow-sm hover:shadow-md',
      success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus-visible:ring-success-500 shadow-sm hover:shadow-md',
    },
    size: {
      xs: 'h-7 px-2.5 text-xs rounded-md gap-1',
      sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-base rounded-lg gap-2',
      xl: 'h-12 px-6 text-base rounded-xl gap-2.5',
    },
  },

  // Input/Form Elements
  input: {
    base: 'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none',
    default: 'border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
    error: 'border-danger-500 hover:border-danger-600 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10',
    disabled: 'bg-neutral-50 text-neutral-500 cursor-not-allowed',
  },

  // Card
  card: {
    base: 'bg-white rounded-xl border border-neutral-200/80 shadow-sm transition-all duration-200',
    interactive: 'hover:shadow-md hover:border-neutral-300 cursor-pointer active:scale-[0.99]',
    elevated: 'shadow-lg border-0',
  },

  // Badge
  badge: {
    base: 'inline-flex items-center justify-center font-medium transition-colors',
    size: {
      sm: 'px-2 py-0.5 text-xs rounded-md',
      md: 'px-2.5 py-1 text-xs rounded-lg',
      lg: 'px-3 py-1.5 text-sm rounded-lg',
    },
    variant: {
      default: 'bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200',
      primary: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200',
      success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-200',
      warning: 'bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200',
      danger: 'bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-200',
      info: 'bg-info-50 text-info-700 ring-1 ring-inset ring-info-200',
    },
    // Solid variants for more prominence
    solid: {
      default: 'bg-neutral-600 text-white',
      primary: 'bg-primary-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-white',
      danger: 'bg-danger-500 text-white',
      info: 'bg-info-500 text-white',
    },
  },

  // Table
  table: {
    wrapper: 'overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm',
    header: 'bg-neutral-50/80 backdrop-blur-sm',
    headerCell: 'px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500',
    row: 'border-t border-neutral-100 transition-colors',
    rowHover: 'hover:bg-neutral-50/80',
    rowStriped: 'even:bg-neutral-50/50',
    cell: 'px-4 py-4 text-sm text-neutral-700',
  },

  // Dialog
  dialog: {
    overlay: 'fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300',
    panel: 'relative z-50 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-neutral-950/5 transition-all duration-300',
    title: 'text-lg font-semibold text-neutral-900',
    description: 'mt-2 text-sm text-neutral-500',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'JetBrains Mono, "Fira Code", Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================
// 4pt base grid system

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================================================
// SHADOWS & ELEVATION
// ============================================================================

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: {
    primary: '0 0 20px rgb(99 102 241 / 0.3)',
    success: '0 0 20px rgb(16 185 129 / 0.3)',
    danger: '0 0 20px rgb(239 68 68 / 0.3)',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// ============================================================================
// ANIMATION KEYFRAMES
// ============================================================================

export const animations = {
  fadeIn: 'fadeIn 200ms ease-out',
  fadeOut: 'fadeOut 150ms ease-in',
  slideUp: 'slideUp 300ms ease-out',
  slideDown: 'slideDown 300ms ease-out',
  scaleIn: 'scaleIn 200ms ease-out',
  spin: 'spin 1s linear infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  shimmer: 'shimmer 2s linear infinite',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// STATUS COLORS MAPPING
// ============================================================================
// Uygulama genelinde kullanılan status renk eşleştirmeleri

export const statusColors = {
  // Study statuses
  Draft: 'default',
  Active: 'success',
  
  // Subject statuses
  Enrolled: 'info',
  Completed: 'success',
  Withdrawn: 'danger',
  
  // Visit statuses
  Scheduled: 'info',
  Missed: 'warning',
  Cancelled: 'danger',
  
  // Form entry statuses
  Complete: 'success',
  Verified: 'primary',
  Pending: 'warning',
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ColorScale = keyof typeof colors;
export type NeutralShade = keyof typeof colors.neutral;
export type PrimaryShade = keyof typeof colors.primary;
export type BadgeVariant = keyof typeof themeClasses.badge.variant;
export type ButtonVariant = keyof typeof themeClasses.button.variant;
export type ButtonSize = keyof typeof themeClasses.button.size;

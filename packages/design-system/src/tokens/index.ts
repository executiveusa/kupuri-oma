/**
 * Kupuri OMA Design Token System
 * Emerald Tablet Standard — LANDING mode (Marketing site)
 *
 * Brand: precise, powerful, Latin-forward, minimal-serious
 * Base: dark neutral (slate-900-950) + violet accent + gold highlights
 */

// ─── Color ──────────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  bg: {
    base: 'oklch(8% 0.01 270)',       // near-black, violet-tinted
    surface: 'oklch(11% 0.012 270)',  // card / panel surface
    overlay: 'oklch(14% 0.015 270)',  // hover / active surface
    border: 'oklch(20% 0.015 270)',   // default border
    borderHover: 'oklch(30% 0.02 270)',
  },

  // Text
  text: {
    primary: 'oklch(95% 0.005 270)',
    secondary: 'oklch(65% 0.01 270)',
    muted: 'oklch(45% 0.01 270)',
    inverse: 'oklch(8% 0.01 270)',
  },

  // Brand accent — violet
  violet: {
    50: 'oklch(97% 0.035 290)',
    100: 'oklch(93% 0.07 290)',
    300: 'oklch(78% 0.15 290)',
    400: 'oklch(68% 0.2 290)',
    500: 'oklch(58% 0.24 290)',    // primary CTA
    600: 'oklch(50% 0.22 290)',
    700: 'oklch(40% 0.18 290)',
    800: 'oklch(28% 0.12 290)',
    900: 'oklch(18% 0.07 290)',
    950: 'oklch(12% 0.05 290)',
  },

  // Gold highlight — for premium / LATAM warmth
  gold: {
    300: 'oklch(82% 0.12 80)',
    400: 'oklch(75% 0.15 80)',
    500: 'oklch(68% 0.18 80)',     // primary gold accent
    600: 'oklch(58% 0.15 80)',
  },

  // Semantic
  success: 'oklch(65% 0.18 145)',
  warning: 'oklch(72% 0.18 85)',
  error: 'oklch(60% 0.22 25)',
  info: 'oklch(65% 0.18 230)',
} as const

// ─── Typography ─────────────────────────────────────────────────────────────

export const typography = {
  fonts: {
    sans: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', 'Fira Code', monospace",
    display: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: '1.2',
    snug: '1.35',
    normal: '1.5',
    relaxed: '1.65',
  },
} as const

// ─── Spacing ─────────────────────────────────────────────────────────────────
// Strict scale per design law — only these values allowed

export const spacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  24: '6rem',    // 96px
} as const

// ─── Border Radius ──────────────────────────────────────────────────────────
// Law 5 — max rounded-xl on cards, rounded-lg on buttons

export const radii = {
  sm: '0.375rem',   // 6px — inputs
  md: '0.5rem',     // 8px — buttons
  lg: '0.625rem',   // 10px — buttons max
  xl: '0.75rem',    // 12px — cards max
  full: '9999px',   // avatars/badges only
} as const

// ─── Shadows ────────────────────────────────────────────────────────────────
// Law 6 — restrained, no colored glow

export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.2)',
  md: '0 2px 8px rgba(0,0,0,0.18)',
  lg: '0 4px 12px rgba(0,0,0,0.25)',
} as const

// ─── Motion ─────────────────────────────────────────────────────────────────
// Presets for Marketing mode (variance:7, motion:5, density:3)

export const motion = {
  durations: {
    fast: 0.15,
    base: 0.2,
    slow: 0.35,
    enter: 0.4,
  },
  easings: {
    smooth: [0.4, 0, 0.2, 1],
    out: [0, 0, 0.2, 1],
    in: [0.4, 0, 1, 1],
  },
  variants: {
    fadeUp: {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideIn: {
      hidden: { opacity: 0, x: -16 },
      visible: { opacity: 1, x: 0 },
    },
  },
} as const

// ─── Breakpoints ────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ─── Z-index scale ──────────────────────────────────────────────────────────

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  toast: 400,
  tooltip: 500,
} as const

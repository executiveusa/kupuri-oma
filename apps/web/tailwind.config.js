/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/design-system/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        neutral: {
          925: '#0d0d14',
          950: '#09090f',
        },
        violet: {
          // overrides for brand precision — oklch-derived approximations
          500: '#7c3aed',
          600: '#6d28d9',
        },
        gold: {
          400: '#d4af37',
          500: '#c9a227',
        },
      },
      borderRadius: {
        // Law 5 — max xl on cards
        DEFAULT: '0.5rem',
      },
      // Spacing law — only these values in the scale
      spacing: {
        4.5: '1.125rem',
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.35s ease-out forwards',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

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
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        neutral: {
          50:  'oklch(0.925 0 0)',
          100: 'oklch(0.863 0 0)',
          200: 'oklch(0.762 0 0)',
          300: 'oklch(0.636 0 0)',
          400: 'oklch(0.52 0 0)',
          500: 'oklch(0.42 0 0)',
          600: 'oklch(0.33 0 0)',
          700: 'oklch(0.252 0 0)',
          800: 'oklch(0.198 0 0)',
          900: 'oklch(0.143 0 0)',
          950: 'oklch(0.103 0 0)',
        },
        violet: {
          400: 'oklch(0.702 0.183 293)',
          500: 'oklch(0.627 0.265 293.6)',
          600: 'oklch(0.558 0.288 292.1)',
          700: 'oklch(0.491 0.27 292.5)',
        },
        gold: {
          400: 'oklch(0.816 0.133 84.7)',
          500: 'oklch(0.742 0.143 82.4)',
          600: 'oklch(0.661 0.143 81.7)',
        },
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

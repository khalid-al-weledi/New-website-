import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#eef2ff', 100: '#e0e7ff', 500: '#1e3a8a',
          600: '#1c2f6b', 700: '#152a63', 800: '#0f1e47', 900: '#0a1530',
        },
        gold: {
          50: '#fffbeb', 100: '#fef3c7', 300: '#fcd34d',
          500: '#d4af37', 600: '#b8860b', 700: '#92600a',
        },
        cream: '#fffef7',
      },
      fontFamily: { arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
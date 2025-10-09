import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#0E0F12',
          panel: '#2B2F38',
          text: '#F7F3ED',
          accent: '#FF5DA2',
          support: '#E6A3B2',
          terracotta: '#D36B52'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)']
      }
    }
  },
  plugins: []
};

export default config;

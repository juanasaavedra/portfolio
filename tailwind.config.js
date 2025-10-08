/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,json}',
  ],
  theme: {
    extend: {
      colors: {
        anthracite: '#141418',
        accent: '#FF5DA2',
        accentSoft: '#FF7BB6',
        accentDeep: '#E9488C',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular'],
      },
      backgroundImage: {
        gridNoise: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
      keyframes: {
        pulseAccent: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,93,162,0.6)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255,93,162,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        pulseAccent: 'pulseAccent 2.6s ease-in-out infinite',
        marquee: 'marquee 24s linear infinite',
      },
    },
  },
  plugins: [],
};

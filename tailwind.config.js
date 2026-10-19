/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kolix: {
          accent: '#6C4CF1',
          'accent-hover': '#5A3BD8',
          'accent-dark': '#3F25A8',
          'accent-deep': '#2E1F86',
          'accent-light': '#F4F1FE',
          'accent-tint': '#EEE9FF',
          'accent-soft': '#E9E3FD',
          navy: '#241D5E',
          'navy-dark': '#16131F',
          'navy-light': '#2E2475',
          bg: '#F4F1FE',
          card: '#FFFFFF',
          border: '#E2DCF8',
          'border-light': '#EEEAFB',
          'border-subtle': '#F0EDFB',
          text: '#16131F',
          'text-muted': '#5E5A70',
          'text-sub': '#8B869C',
          gold: '#F5C800',
          red: '#D6304A',
          'red-light': '#FCE3E0',
          'red-dark': '#8A2414',
          orange: '#FFEBDD',
          'orange-text': '#8A3D0A',
          green: '#7CE0AE',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'kolix-sm': '0 4px 12px rgba(108, 76, 241, 0.05)',
        'kolix': '0 6px 20px rgba(108, 76, 241, 0.07)',
        'kolix-md': '0 8px 24px rgba(108, 76, 241, 0.09)',
        'kolix-lg': '0 14px 34px rgba(108, 76, 241, 0.16)',
        'kolix-cta': '0 10px 24px rgba(108, 76, 241, 0.35)',
        'kolix-navy': '0 14px 34px rgba(36, 29, 94, 0.18)',
        'kolix-gold': '0 14px 34px rgba(160, 125, 0, 0.28)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
      }
    },
  },
  plugins: [],
}

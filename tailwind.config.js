/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#07070f',
          100: '#0e0e1c',
          200: '#141428',
          300: '#1a1a35',
          400: '#1f1f40',
        },
        accent: {
          pink: '#ff4daa',
          purple: '#a855f7',
          blue: '#38bdf8',
          gold: '#fbbf24',
          green: '#22c55e',
        },
        text: {
          primary: '#f0f0ff',
          secondary: '#9090b8',
          muted: '#50507a',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '22px',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-dots': 'bounceDots 1.2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 22px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 44px rgba(168, 85, 247, 0.6)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        bounceDots: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        'glass': '24px',
      }
    },
  },
  plugins: [],
}

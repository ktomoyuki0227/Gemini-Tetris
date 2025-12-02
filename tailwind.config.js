/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shake': 'shake 0.15s cubic-bezier(.36,.07,.19,.97) both',
        'flash': 'flash-white 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'gradient-x': 'gradientX 3s ease infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(2px)' },
          '50%': { transform: 'translateY(-2px)' },
          '75%': { transform: 'translateY(2px)' },
        },
        'flash-white': {
          '0%': { filter: 'brightness(3)', transform: 'scale(1.02)' },
          '50%': { filter: 'brightness(2)', transform: 'scale(1)' },
          '100%': { filter: 'brightness(1)', transform: 'scale(0)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientX: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
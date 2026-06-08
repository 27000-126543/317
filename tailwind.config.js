/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#95D5B2',
          400: '#74c69d',
          500: '#52b788',
          600: '#40916c',
          700: '#2D6A4F',
          800: '#1b4332',
          900: '#0d2818',
        },
        accent: {
          DEFAULT: '#F4A261',
          light: '#F7C59F',
          dark: '#E76F51',
        },
        eco: {
          blue: '#457B9D',
          cream: '#F1FAEE',
          sand: '#A8DADC',
        },
      },
      fontFamily: {
        display: ['"Noto Sans SC"', 'sans-serif'],
        body: ['"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1b4332 0%, #2D6A4F 40%, #40916c 100%)',
        'card-gradient': 'linear-gradient(135deg, #2D6A4F 0%, #52b788 100%)',
        'accent-gradient': 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'eco': '0 4px 14px 0 rgba(45,106,79,0.15)',
        'eco-lg': '0 8px 30px 0 rgba(45,106,79,0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

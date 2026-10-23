/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFF7F0',
          100: '#FBF4EE',
          200: '#F5E8DC',
          300: '#EFD9C8',
        },
        coral: {
          50: '#FFF5F7',
          100: '#FFE0E6',
          200: '#FFC9D5',
          300: '#FFB6C1',
          400: '#FF8FA0',
          500: '#F76B7E',
          600: '#D85068',
          700: '#A23C50',
        },
        lavender: {
          100: '#F5EFFC',
          200: '#E8D8FF',
          300: '#D0B8F0',
          400: '#B896E0',
          500: '#9A74CC',
          600: '#7D58B0',
        },
        blush: {
          100: '#FCE8EC',
          200: '#F9D1DA',
          300: '#F3A8B8',
          400: '#E87E96',
        },
        mint: {
          100: '#E8F6F0',
          200: '#BFE8D8',
          300: '#8FD4B5',
          400: '#5FB896',
          500: '#3D9A78',
        },
        peach: {
          100: '#FFF5E8',
          200: '#FFDEB2',
          300: '#FFC78A',
          400: '#F5A862',
          500: '#D88B45',
        },
        plum: {
          50: '#F7F5F8',
          100: '#E8E2EA',
          200: '#C9BCCD',
          300: '#9A86A0',
          400: '#6B566F',
          500: '#4A2C5A',
          600: '#3D2450',
          700: '#2E1A3D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(74, 44, 90, 0.07)',
        card: '0 4px 24px rgba(74, 44, 90, 0.09)',
        float: '0 8px 32px rgba(74, 44, 90, 0.14)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'sway': 'sway 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}

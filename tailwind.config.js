/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBF7',
          100: '#FBF4EE',
          200: '#F5E8DC',
          300: '#EFD9C8',
        },
        coral: {
          50: '#FFF0ED',
          100: '#FFD9D1',
          200: '#FFB3A4',
          300: '#FF8B73',
          400: '#F76B53',
          500: '#E85538',
          600: '#C7442D',
          700: '#A23624',
        },
        lavender: {
          100: '#EFEAF6',
          200: '#DCD2EF',
          300: '#C4B5E3',
          400: '#A894D4',
          500: '#8B72C4',
          600: '#7056B0',
        },
        blush: {
          100: '#FCE8EC',
          200: '#F9D1DA',
          300: '#F3A8B8',
          400: '#E87E96',
        },
        plum: {
          50: '#F7F5F8',
          100: '#E8E2EA',
          200: '#C9BCCD',
          300: '#9A86A0',
          400: '#6B566F',
          500: '#4A374E',
          600: '#322A34',
          700: '#231E26',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 12px rgba(74, 55, 78, 0.06)',
        card: '0 4px 24px rgba(74, 55, 78, 0.08)',
        float: '0 8px 32px rgba(74, 55, 78, 0.12)',
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
      },
    },
  },
  plugins: [],
}

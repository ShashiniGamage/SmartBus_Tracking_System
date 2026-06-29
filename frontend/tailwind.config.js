/* @type {import('tailwindcss').Config} 
export default {
  content: ['./index.html', './src/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#C8102E', dark: '#9B0C23', light: '#E8374F' },
        navy:     { DEFAULT: '#1A1A2E', light: '#22223F' },
        cream:    '#FFF8F8',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up':  'slideUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    },
  },
  plugins: [],
}*/



/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8192C',   //vivid red
          dark:    '#B5121F',   // deep dark red
          light:   '#FF4D5E',   // soft light red
        },
        navy: {
          DEFAULT: '#0D0D1A',   // very deep navy/black
          light:   '#1A1A2E',
        },
        cream: '#FFF5F5',       // warm red-tinted white
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.6s ease forwards',
        'fade-in':  'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    },
  },
  plugins: [],
}
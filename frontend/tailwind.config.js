/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryRed: '#dc2626', // Attractive Red
        darkRed: '#991b1b',
        lightRed: '#fef2f2',
        pureWhite: '#ffffff',
        darkGray: '#1f2937',
      }
    },
  },
  plugins: [],
}
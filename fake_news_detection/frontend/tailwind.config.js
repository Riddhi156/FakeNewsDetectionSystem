/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'veritas-bg':         '#fcfcfc',
        'veritas-navy':       '#0a2e57',
        'veritas-accent':     '#0f4886',
        'veritas-light':      '#f0f3f6',
        'veritas-green':      '#a4e8a4',
        'veritas-red':        '#fcd2d0',
        'veritas-light-blue': '#4a9eda',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

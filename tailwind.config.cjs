/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          200: 'hsl(0 0% 80%)',
          300: 'hsl(0 0% 70%)',
          400: 'hsl(0 0% 60%)',
          700: 'hsl(0 0% 30%)',
          800: 'hsl(0 0% 20%)'
        },
        'black-100': '#0b0b0b'
      }
    }
  },
  plugins: []
}

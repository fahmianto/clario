/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fb',
          100: '#eef3f8',
          200: '#dce6f0',
          300: '#c2d4e5',
          400: '#a3bdd6',
          500: '#759fc0',
          600: '#527fa6', // Calm, professional blue-grey
          700: '#416584',
          800: '#35536d',
          900: '#2b4458',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}

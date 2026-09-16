/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5C48',
          50: '#FFF1EC',
          100: '#FFDFD3',
          600: '#FF5C48',
          700: '#E04A37',
        },
        ink: {
          DEFAULT: '#1C1917',
          800: '#292524',
          700: '#44403C',
        },
        canvas: '#F7F2E9',
        sand: '#ECE3D2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(80, 60, 35, 0.06)',
        pop: '0 4px 12px rgba(80, 60, 35, 0.10)',
      },
    },
  },
  plugins: [],
}

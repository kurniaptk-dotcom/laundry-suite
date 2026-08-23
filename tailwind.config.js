/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary Blue
          700: '#1D4ED8', // Deep Blue
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#0B0F19',
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'subtle': '0 1px 2px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}

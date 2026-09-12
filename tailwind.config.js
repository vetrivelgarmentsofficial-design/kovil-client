/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Mukta Malar',
          'Noto Sans Tamil',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        varavu: {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
          dark: '#15803d',
          hover: '#14532d',
        },
        selavu: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
          hover: '#991b1b',
        },
      },
    },
  },
  plugins: [],
}

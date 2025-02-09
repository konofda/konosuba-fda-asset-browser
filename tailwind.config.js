/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      utilities: {
        '.truncate-left': {
          direction: 'rtl',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.truncate-left': {
          direction: 'rtl',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }
      });
    }
  ],
};
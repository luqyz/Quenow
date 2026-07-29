/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        queueGreen: '#22c55e',
        queueYellow: '#facc15',
        queueRed: '#ef4444',
      },
    },
  },
  plugins: [],
};

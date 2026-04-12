/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-once': 'bounce 0.6s ease-out'
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,vue}'],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(240 5.9% 90%)',
      },
      colors: {
        primary: 'var(--color-primary)',
      }
    },
  },
  plugins: [],
};

const { colors } = require('tailwindcss/colors');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        ...colors,
        'my-color1': '#f5f5f4', //stone
        'my-color2': '#e7e5e4',
        'my-color3': '#d6d3d1',
        'my-color4': '#a8a29e',
        'my-color5': '#78716c',
        'my-color6': '#57534e',
        'my-color7': '#44403c',
        'my-color8': '#292524',
        'my-color9': '#1c1917',
        'my-color10': '#0c0a09',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

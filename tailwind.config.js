/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E60023',
        dark: '#111111',
        light: '#EFEFEF',
        lightHover: '#d7d7d7',
        muted: '#717171',
        lightGray: '#FAFAFA',
        lilac: '#E9E2F3',
        purple: '#55356E',
        powderBlue: '#D6F5FF'
      },
      extend: {
        fonts: {
          poppins: ['Poppins', 'sans-serif']
        }
      }
    }
  },
  plugins: []
};

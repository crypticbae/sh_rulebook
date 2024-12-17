/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: {
              DEFAULT: '#9ca3af', // text-gray-400
              light: '#374151', // text-gray-700
            },
            h1: {
              color: {
                DEFAULT: '#ffffff',
                light: '#111827',
              },
            },
            h2: {
              color: {
                DEFAULT: '#ffffff',
                light: '#111827',
              },
            },
            h3: {
              color: {
                DEFAULT: '#ffffff',
                light: '#111827',
              },
            },
            strong: {
              color: {
                DEFAULT: '#ffffff',
                light: '#111827',
              },
            },
            a: {
              color: '#911111',
              '&:hover': {
                color: '#b92a2a',
              },
            },
          },
        },
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

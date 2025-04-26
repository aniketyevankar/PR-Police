/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        github: {
          blue: {
            DEFAULT: '#0969da',
            light: '#2188ff',
            dark: '#0550ae'
          },
          gray: {
            50: '#f6f8fa',
            100: '#eaeef2',
            200: '#d0d7de',
            300: '#afb8c1',
            400: '#8c959f',
            500: '#6e7781',
            600: '#57606a',
            700: '#424a53',
            800: '#32383f',
            900: '#24292f'
          },
          green: {
            DEFAULT: '#2da44e',
            light: '#3fb950',
            dark: '#238636'
          },
          red: {
            DEFAULT: '#cf222e',
            light: '#f85149',
            dark: '#a40e26'
          },
          yellow: {
            DEFAULT: '#bf8700',
            light: '#e3b341',
            dark: '#9e6a03'
          }
        }
      },
      boxShadow: {
        'github': '0 1px 0 rgba(27,31,36,0.04)',
        'github-md': '0 3px 6px rgba(140,149,159,0.15)',
        'github-lg': '0 8px 24px rgba(140,149,159,0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
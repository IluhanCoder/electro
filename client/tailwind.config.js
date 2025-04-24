/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          bounceWave: {
            '30%, 50%, 100%': { transform: 'translateY(0)' },
            '10%': { transform: 'translateY(-50%)' },
          },
        },
        animation: {
          bounceWave: 'bounceWave 1s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }
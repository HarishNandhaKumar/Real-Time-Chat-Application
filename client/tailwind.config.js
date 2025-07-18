/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // adjust path to your source files
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.3s linear infinite',
      },
      backgroundSize: {
        shimmer: '400% 100%',
      },
      backgroundImage: {
        shimmer: 'linear-gradient(to right, #2e2e2e 4%, #3b3b3b 25%, #2e2e2e 36%)',
      }
    },
  },
  plugins: [],
}

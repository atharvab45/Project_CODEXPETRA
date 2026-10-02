/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        globeRotate: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-200px 0' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        globeRotate: 'globeRotate 8s linear infinite',
      },
    },
  },
  plugins: [],
}

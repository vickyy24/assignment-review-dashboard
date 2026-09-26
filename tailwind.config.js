/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(30px, 20px) scale(1.08)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      },
      animation: {
        float: 'float 8s ease-in-out infinite alternate',
        fadeIn: 'fadeIn 0.18s ease',
        slideUp: 'slideUp 0.22s ease',
      }
    }
  },
  plugins: [],
}

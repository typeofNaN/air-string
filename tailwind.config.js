import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#173c2a',
        ink: '#20251f',
        bone: '#f2efe7',
        paper: '#faf8f2',
        terra: '#b75f47',
        lime: '#dfea96',
        line: '#d6d1c6',
        muted: '#77796f',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      keyframes: {
        'strum-pop': {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(.8)' },
          '45%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(35px) scale(1.08)' },
        },
      },
      animation: { 'strum-pop': 'strum-pop .48s ease-out both' },
    },
  },
  plugins: [animate],
}

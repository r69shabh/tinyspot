/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1d1d1f',
        'ink-2': '#6e6e73',
        'ink-3': '#86868b',
        mist: '#f5f5f7',
        hairline: '#d2d2d7',
        'apple-green': '#1f8a4c',
        'apple-blue': '#0071e3',
        'apple-gold': '#e5a00d',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'apple': '0 4px 20px -2px rgba(0,0,0,0.06), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'apple-hover': '0 10px 30px -4px rgba(0,0,0,0.12), 0 4px 10px -2px rgba(0,0,0,0.06)',
        'glow': '0 0 25px rgba(0, 113, 227, 0.25)',
      }
    },
  },
  plugins: [],
}

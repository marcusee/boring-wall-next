module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      gridTemplateColumns: {
        '64': 'repeat(64, minmax(0, 1fr))',
        '32': 'repeat(32, minmax(0, 1fr))',
        '33': 'repeat(33, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}

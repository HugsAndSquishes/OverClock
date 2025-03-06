module.exports = {
  content: [
    './components/**/*.{vue,js,ts}', // Include Vue/JS/TS files in the components folder
    './layouts/**/*.vue', // Include Vue files in the layouts folder
    './pages/**/*.vue', // Include Vue files in the pages folder
    './app.vue', // Include the main app.vue file
  ],
  theme: {
    extend: {}, // Extend Tailwind's default theme (optional)
  },
  plugins: [], // Add Tailwind plugins (optional)
};
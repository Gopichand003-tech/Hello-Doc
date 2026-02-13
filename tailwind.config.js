/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "system-ui"],
        cursive: ["var(--font-pacifico)", "cursive"],
        logo: ["var(--font-greatvibes)", "cursive"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0043a7", // Color principal
        secondary: "#004ebb",
        accent: "#00bfff",
      }
    },
  },
  plugins: [],
}
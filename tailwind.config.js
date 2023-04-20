/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#146173",
        secondary: "#F22233",
        tertiary: "#BFAE99",
        primaryLight: "#16808C",
        secondaryLight: "#D97777",
      }
    },
  },
  plugins: [],
}

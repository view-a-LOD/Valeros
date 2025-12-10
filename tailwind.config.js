/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Familjen Grotesk", "sans-serif"],
        mono: ["Familjen Grotesk", "sans-serif"],
      },
      screens: {
        "3xl": "1792px",
        "4xl": "2048px",
        "5xl": "2304px",
        "6xl": "2560px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: { themes: [{ main: require("./tailwind-theme-export.js") }] },
};

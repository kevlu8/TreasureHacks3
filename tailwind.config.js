const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      tn: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      "2xl": "1536px",
    },
    colors: {
      "text-primary": "#0098f7",
      "text-primary-variant": "#007bc7",
      "text-header": "#FFFFFFE6",
      "text-body": "#FFFFFF99",
      "bg-primary": "#111d25",
      "bg-secondary": "#1c2830",
      "bg-tertiary": "#202c34",
      "border": "#FFFFFF0D",
      black: colors.black,
      transparent: "transparent"
    },
    extend: {
      fontFamily: {
        primaryOld: ["Inter", ...fontFamily.sans],
        primary: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        montserrat: ["Montserrat", ...fontFamily.sans],
      },
      keyframes: {},
      animation: {},
    },
  },
};

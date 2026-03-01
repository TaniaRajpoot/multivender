/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["DM Sans", "sans-serif"],
      display: ["Cormorant Garamond", "serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#3b82f6", // your custom primary
      },
      screens: {
        "800px": "800px",
        "sm-custom": "800px",
        "md-custom": "1050px",
        "lg-custom": "1110px",
        "xl-custom": "1300px",
        "xs-custom": "400px",
      },
    },
  },
  plugins: [],
};

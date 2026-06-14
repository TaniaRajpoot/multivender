/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        brand: "#16697A",
        accent: "#FFA62B",
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

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#3b82f6", // your custom primary
      },
      screens: {
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

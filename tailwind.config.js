/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        uberBlack: "#000000",
        pureWhite: "#ffffff",
        bodyGray: "#4b4b4b",
        mutedGray: "#afafaf",
        chipGray: "#efefef",
        hoverGray: "#e2e2e2",
        hoverLight: "#f3f3f3"
      },
      borderRadius: {
        pill: "999px"
      }
    }
  },
  plugins: []
};

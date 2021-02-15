const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./app/**/*.{js,ts,tsx,md,mdx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      flex: {
        sidebar: "0 0 300px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};

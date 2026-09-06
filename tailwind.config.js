/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B85042", // terracotta
          dark: "#8F3C31",
          light: "#FBEEEA",
        },
        secondary: {
          DEFAULT: "#3F6C51", // growth green
          dark: "#2E4F3B",
          light: "#EAF3EC",
        },
        accent: {
          DEFAULT: "#C9932F", // gold
          light: "#F6E8CB",
        },
        ink: "#2B2118",
        muted: "#756A5E",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

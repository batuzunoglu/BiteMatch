/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF512E", // Exact brand orange from HTML
          light: "rgba(255, 81, 46, 0.1)",  // primary/10
        },
        surface: "#FFFFFF",
        accent: "#F8F6F5", // Exact background-light from HTML
        gold: "#FFB75E",
        muted: "#94A3B8",
        dark: "#1D0F0C", // Exact text-dark from HTML
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pipo: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#2f80ed",
          600: "#1f6fdc",
          700: "#1a5ab3",
        },
        sol: "#ffb020",
      },
      fontFamily: { sans: ["Nunito", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};

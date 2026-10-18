/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F172A", light: "#1E293B", dark: "#020617" },
        red: { DEFAULT: "#DC2626", light: "#EF4444", dark: "#B91C1C" },
        orange: { DEFAULT: "#DC2626", light: "#EF4444", dark: "#B91C1C" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
}
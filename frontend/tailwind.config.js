/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        car_transition: "car_transition 1s ease",
      },
      keyframes: {
        car_transition: {
          "0%": { right: "-400px" },
          "100%": { right: "2rem" },
        },
      },
      colors: {
        "primary-bg": "var(--background-primary)",
        "primary-text": "var(--text-primary)",
        "secondary-bg": "var(--background-secondary)",
        "secondary-text": "var(--text-secondary)",
        light: "var(--text-light)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

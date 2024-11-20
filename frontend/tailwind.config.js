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
        primary: {
          bg: '#e09d52',    // Orange/Gold
          text: '#000a6a',  // Navy blue
        },
        secondary: {
          bg: '#BCD15C',    // Lime green
          accent: '#0FA3B1', // Teal
        },
        light: '#EAE8FF'    // Light lavender
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

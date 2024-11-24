import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        moveDown: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        moveUp: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-100%)",
          },
        },
        whiteToBlack: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "rgba(0, 0, 0, .6)" },
        },
        blackToWhite: {
          "0%": { backgroundColor: "rgba(0, 0, 0, .6)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        moveDown: "moveDown 0.3s ease-in-out",
        moveUp: "moveUp 0.3s ease-in-out",
        whiteToBlack: "whiteToBlack 0.3s ease-in-out",
        blackToWhite: "blackToWhite 0.3s ease-in-out",
      },
    },
  },
  darkMode: "selector",
  plugins: [],
} satisfies Config;

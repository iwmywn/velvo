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
        topToCenter: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        centerToTop: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(-150%)",
          },
        },
        rightToLeft: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        leftToRight: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(150%)",
          },
        },
        bottomToCenter: {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        centerToBottom: {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(150%)",
          },
        },
        popUpIn: {
          "0%": {
            transform: "translateY(-150%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        popUpOut: {
          "0%": {
            transform: "translateY(0%)",
          },
          "100%": {
            transform: "translateY(150%)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        zoomIn: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        zoomOut: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        topToCenter: "topToCenter 0.3s ease-in-out",
        centerToTop: "centerToTop 0.3s ease-in-out",
        fadeIn: "fadeIn 0.3s ease-in-out",
        fadeOut: "fadeOut 0.3s ease-in-out",
        rightToLeft: "rightToLeft 0.3s ease-in-out",
        leftToRight: "leftToRight 0.3s ease-in-out",
        bottomToCenter: "bottomToCenter 0.3s ease-in-out",
        centerToBottom: "centerToBottom 0.3s ease-in-out",
        popUpIn: "popUpIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        popUpOut: "popUpOut 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
        zoomIn: "zoomIn 0.3s ease-in-out",
        zoomOut: "zoomOut 0.3s ease-in-out",
        slideDown: "slideDown 0.3s ease-out forwards",
        slideUp: "slideUp 0.3s ease-in forwards",
      },
    },
  },
  darkMode: "selector",
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D6FB61",        // Neon Acid Lime
          ink: "#0A0D0E",            // Dark text on lime
          dim: "#B8DD42",            // Active / pressed
          soft: "rgba(214, 251, 97, 0.12)", // Washes & pill backgrounds
          glow: "rgba(214, 251, 97, 0.25)",
        },
        canvas: {
          DEFAULT: "#F7F9F6",        // Light mode background
          dark: "#0A0D0E",           // Obsidian
        },
        surface: {
          light: "#FFFFFF",
          subtleLight: "#EFF1F4",
          dark: "#161B1E",           // Raised card surface
          subtleDark: "#1F262B",     // Recessed containers / inputs
        },
        ink: {
          light: "#0A0D0E",
          subtleLight: "#585F54",
          dark: "#F1F5F9",
          subtleDark: "#94A3B8",
        },
        accent: {
          violet: "#4F46E5",
          coral: "#FF4D4D",
          cyan: "#00F2B5",
        },
        border: {
          light: "rgba(10, 13, 14, 0.08)",
          dark: "rgba(255, 255, 255, 0.08)",
        }
      },
      borderRadius: {
        'card': '24px',
        'sheet': '32px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};


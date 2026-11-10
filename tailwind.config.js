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
          DEFAULT: "#047857",        // Imperial Emerald
          dark: "#10B981",           // Luminous Emerald in dark mode
          ink: "#FFFFFF",
          pressed: "#065F46",
          soft: "rgba(4, 120, 87, 0.10)",
          softDark: "rgba(16, 185, 129, 0.15)",
        },
        ground: {
          light: "#F8F9FA",          // Architectural Porcelain
          dark: "#090A0E",           // OLED Obsidian
        },
        raised: {
          light: "#FFFFFF",          // Crisp White
          dark: "#13171F",           // Dark Titanium
          subtleLight: "#F1F3F5",
          subtleDark: "#1C222D",
        },
        ink: {
          light: "#0B0E14",          // Deep Carbon
          ink2Light: "#475569",      // Tinted Cool Slate
          ink3Light: "#8C96A5",      // Tertiary Slate
          dark: "#F8FAFC",           // Snow White
          ink2Dark: "#94A3B8",       // Muted Sterling
          ink3Dark: "#64748B",       // Deep Slate
        },
        rule: {
          light: "rgba(15, 23, 42, 0.08)",
          dark: "rgba(255, 255, 255, 0.08)",
        },
        semantic: {
          positive: "#059669",
          positiveDark: "#34D399",
          negative: "#DC2626",
          negativeDark: "#F87171",
        }
      },
      borderRadius: {
        'card': '22px',
        'sheet': '32px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};

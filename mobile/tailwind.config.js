/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-hover": "#1d4ed8",
        bg: "#f5f7fa",
        surface: "#ffffff",
        text: "#0f172a",
        muted: "#64748b",
        border: "#e2e8f0",
        success: "#16a34a",
        danger: "#dc2626",
      },
    },
  },
  plugins: [],
};

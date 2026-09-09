/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forest: "#0B5D3B",
        moss: "#1E8D62",
        mint: "#C9F2D8",
        canvas: "#F5F7F2",
        ink: "#10281D",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(30, 141, 98, 0.16)",
      },
    },
  },
  plugins: [],
}


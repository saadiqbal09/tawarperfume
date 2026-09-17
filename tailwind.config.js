/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tawar: { offwhite: "#F9F7F4", cream: "#F1ECE3", black: "#1A1A1A", charcoal: "#2E2E2E", gold: "#C9A84C", "gold-light": "#E8D5A3", "gold-dark": "#A8862F" }
      },
      fontFamily: { display: ["var(--font-playfair)"], sans: ["var(--font-inter)"] },
      boxShadow: { tawar: "0 12px 35px rgba(26,26,26,.08)", "tawar-lg": "0 24px 60px rgba(26,26,26,.12)" },
      letterSpacing: { luxury: "0.15em" }
    }
  },
  plugins: []
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ground: "#0B0D10",
        raised: "#12161B",
        line: "#1E262D",
        string: "#E0A03F",
        "string-dim": "#3A4A54",
        // All three clear WCAG AA (4.5:1) on the ground colour:
        // 15.8:1, 8.9:1 and 6.0:1 respectively.
        ink: "#E4E8EB",
        "ink-mute": "#A7B1B9",
        "ink-faint": "#869099",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        goldwhite: '#FFFFFF',
        gold: '#FFD700',
      },
    },
  },
  plugins: [require("daisyui")],
}


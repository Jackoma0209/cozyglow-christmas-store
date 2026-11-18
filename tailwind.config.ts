import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          950: "#0B1914",
          900: "#10241D",
          800: "#163329",
          700: "#1F4739",
        },
        crimson: {
          600: "#B91C1C",
          700: "#991B1B",
        },
        amberGlow: {
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
        },
        cream: {
          50: "#FFFDF8",
          100: "#FDF8EE",
          200: "#F7ECD8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        "warm-glow": "0 0 40px -8px rgba(251, 191, 36, 0.45)",
        "card-soft": "0 14px 40px -12px rgba(16, 36, 29, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;

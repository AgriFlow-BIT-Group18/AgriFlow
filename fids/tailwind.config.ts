import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2D6A4F",
          dark: "#1B4332",
        },
        secondary: "#52B788",
        accent: "#F4A261",
        "background-alt": "#F8F9FA",
        surface: "#FFFFFF",
        "text-primary": "#1B1B1B",
        "text-secondary": "#6B7280",
        status: {
          pending: "#F59E0B",
          approved: "#3B82F6",
          delivery: "#F97316",
          delivered: "#22C55E",
          rejected: "#EF4444",
        },
        sidebar: "#1B4332",
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
};
export default config;

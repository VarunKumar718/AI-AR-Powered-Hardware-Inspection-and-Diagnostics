import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deepest: "var(--bg-deepest, #F8FAFC)",
          base: "var(--bg-base, #F8FAFC)",
          elevated: "var(--bg-elevated, #F1F5F9)",
          card: "var(--bg-card, #FFFFFF)",
        },
        border: {
          subtle: "var(--border-subtle, #E2E8F0)",
          strong: "var(--border-strong, #CBD5E1)",
          glow: "#0D9488",
        },
        brand: {
          teal: "#0D9488",
          cyan: "#0D9488",
          darkTeal: "#0F766E",
          hover: "#0F766E",
          tint: "#F0FDFA",
        },
        status: {
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
          info: "#0D9488",
          simulated: "#B45309",
          simulatedBg: "#FEF3C7",
        },
        text: {
          primary: "var(--text-primary, #0F172A)",
          secondary: "var(--text-secondary, #475569)",
          muted: "var(--text-muted, #94A3B8)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "cyan-glow": "none",
        "card-glass": "0 1px 3px 0 rgb(0 0 0 / 0.05)",
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

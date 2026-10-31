import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deepest: "#050B18",
          base: "#0A1428",
          elevated: "#14264A",
          card: "#0F1D38",
        },
        border: {
          subtle: "rgba(34, 211, 238, 0.12)",
          strong: "rgba(34, 211, 238, 0.3)",
          glow: "rgba(34, 211, 238, 0.5)",
        },
        brand: {
          cyan: "#22D3EE",
          teal: "#14B8A6",
          violet: "#818CF8",
        },
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#F87171",
          info: "#38BDF8",
          simulated: "#F59E0B",
          real: "#10B981",
        },
        text: {
          primary: "#E6F1FF",
          secondary: "#8FA3C0",
          muted: "#5B7090",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Sora", "system-ui", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      animation: {
        "scan-line": "scanline 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "glow-ping": "glowPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        scanline: {
          "0%": { top: "0%", opacity: "0.2" },
          "50%": { opacity: "0.85" },
          "100%": { top: "100%", opacity: "0.2" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        glowPing: {
          "75%, 100%": {
            transform: "scale(1.8)",
            opacity: "0",
          },
        },
      },
      boxShadow: {
        "cyan-glow": "0 0 25px -5px rgba(34, 211, 238, 0.25)",
        "card-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

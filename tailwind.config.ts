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
        background: "#070709",
        surface: "rgba(255,255,255,0.04)",
        "surface-hover": "rgba(255,255,255,0.07)",
        "border-subtle": "rgba(255,255,255,0.08)",
        "border-hover": "rgba(255,255,255,0.16)",
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        "accent-purple": "#8b5cf6",
        "accent-cyan": "#22d3ee",
        "accent-blue": "#3b82f6",
        "accent-emerald": "#10b981",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)",
        "gradient-subtle": "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.12) 100%)",
        "gradient-node": "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(34,211,238,0.1) 100%)",
      },
      animation: {
        "float-slow": "floatAnim 8s ease-in-out infinite",
        "float-medium": "floatAnim 6s ease-in-out infinite 1.5s",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
        "grid-scroll": "gridScroll 20s linear infinite",
        "node-pulse": "nodePulse 2.5s ease-in-out infinite",
        "data-flow": "dataFlow 2s linear infinite",
        "border-spin": "borderSpin 4s linear infinite",
        "scan-down": "scanDown 3s linear infinite",
      },
      keyframes: {
        floatAnim: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-24px) translateX(12px)" },
          "66%": { transform: "translateY(12px) translateX(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        gridScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 80px" },
        },
        nodePulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139,92,246,0.5), 0 0 12px rgba(139,92,246,0.2)" },
          "50%": { boxShadow: "0 0 0 6px rgba(139,92,246,0), 0 0 20px rgba(139,92,246,0.4)" },
        },
        dataFlow: {
          "0%": { strokeDashoffset: "200" },
          "100%": { strokeDashoffset: "0" },
        },
        borderSpin: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        scanDown: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(600%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

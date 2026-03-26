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
        background: "#0a0a0a",
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)",
        "gradient-subtle": "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.12) 100%)",
      },
      animation: {
        "float-slow": "floatAnim 8s ease-in-out infinite",
        "float-medium": "floatAnim 6s ease-in-out infinite 1.5s",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;

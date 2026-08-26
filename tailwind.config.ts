import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: "#050505",
        accentBlue: "#00E676", // Repurposed to Hero Page Green to match themes globally
        accentYellow: "#eab308",
        accentGreen: "#00B259",
        accentRed: "#ef4444",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.4)" },
          "50%": { boxShadow: "0 0 0 6px rgba(59,130,246,0)" },
        },
        "flowing-dash": {
          "to": { strokeDashoffset: "-14" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "pulse-glow": "pulse-glow 1.6s ease-in-out infinite",
        "flowing-dash": "flowing-dash 1s linear infinite",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;

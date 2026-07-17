import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#020617",
          900: "#071B34",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        },
        cyan: {
          400: "#22D3EE",
          500: "#00C2FF",
        },
        indigo: {
          500: "#4F46E5",
          600: "#4338CA",
        },
        glass: {
          bg: "rgba(15,23,42,0.65)",
          border: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.08)",
        },
        signal: {
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          blue: "#3B82F6",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35)",
        glow: "0 0 30px rgba(0,194,255,0.25)",
        "glow-purple": "0 0 30px rgba(79,70,229,0.25)",
        "card-hover": "0 20px 40px rgba(0,0,0,0.4)",
      },
      backdropBlur: {
        glass: "24px",
      },
      animation: {
        "orb-1": "orb1 25s ease-in-out infinite",
        "orb-2": "orb2 30s ease-in-out infinite",
        "orb-3": "orb3 20s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in": "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.4s ease-out",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "counter": "counter 1.5s ease-out forwards",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        orb1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(100px, -50px) scale(1.1)" },
          "50%": { transform: "translate(-50px, 80px) scale(0.9)" },
          "75%": { transform: "translate(80px, 40px) scale(1.05)" },
        },
        orb2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-80px, 60px) scale(1.15)" },
          "66%": { transform: "translate(60px, -80px) scale(0.85)" },
        },
        orb3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(70px, 70px) scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

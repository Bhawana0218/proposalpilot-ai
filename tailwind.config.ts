import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0F1C",
          900: "#0F1729",
          800: "#161F35",
          700: "#212B45",
          600: "#2E3A5C",
        },
        parchment: {
          50: "#FBF9F3",
          100: "#F4EFE2",
          200: "#E9E1CC",
        },
        gold: {
          400: "#D9B65C",
          500: "#C9A227",
          600: "#A9831B",
        },
        signal: {
          green: "#3FA772",
          amber: "#D9A441",
          red: "#C4574A",
          blue: "#4C7EF3",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        dossier: "0 30px 60px -20px rgba(10, 15, 28, 0.45)",
      },
      backgroundImage: {
        seal: "radial-gradient(circle at 30% 30%, #D9B65C, #A9831B 70%)",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "ferxxo-green": "var(--ferxxo-green)",
        "ferxxo-dark": "var(--ferxxo-dark)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "accent-purple": "var(--accent-purple)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        "neon-sm": "0 0 18px rgb(0 255 127 / 0.12)",
        "neon": "0 0 32px rgb(0 255 127 / 0.2)",
      },
      backgroundImage: {
        "edge-gradient":
          "linear-gradient(135deg, rgb(0 255 127 / 0.28), rgb(139 92 246 / 0.12) 48%, rgb(255 255 255 / 0.04))",
        "green-glow":
          "radial-gradient(ellipse at top left, rgb(0 255 127 / 0.10), transparent 55%)",
      },
    },
  },
  plugins: [],
};

export default config;

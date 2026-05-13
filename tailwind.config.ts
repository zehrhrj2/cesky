import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "accent-bg": "var(--accent-bg)",
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
        "card-border": "var(--card-border)",
        tx: "var(--text)",
        tx2: "var(--text2)",
        cgreen: "var(--green)",
        cred: "var(--red)",
        cblue: "var(--blue)",
        cpurple: "var(--purple)",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "14px",
      },
      boxShadow: {
        accent: "0 4px 20px rgba(249,115,22,0.3)",
        "accent-hover": "0 6px 24px rgba(249,115,22,0.4)",
      },
      backgroundImage: {
        gradient: "var(--gradient)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        pop: "pop 0.4s ease",
        shake: "shake 0.4s ease",
        "slide-up": "slideUp 0.4s ease",
        "flash-green": "flashG 0.5s ease",
        "flash-red": "flashR 0.5s ease",
        "dot-bounce": "dotBounce 1.4s ease infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        flashG: {
          "0%": { background: "rgba(34,197,94,0.3)" },
          "100%": { background: "transparent" },
        },
        flashR: {
          "0%": { background: "rgba(239,68,68,0.3)" },
          "100%": { background: "transparent" },
        },
        dotBounce: {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

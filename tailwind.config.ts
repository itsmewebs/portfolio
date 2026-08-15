import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dual-Theme Tokens driven by CSS Variables in globals.css
        background: "rgb(var(--background) / <alpha-value>)",
        "on-background": "rgb(var(--on-background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-dim": "rgb(var(--surface-dim) / <alpha-value>)",
        "surface-bright": "rgb(var(--surface-bright) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--surface-container-highest) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--inverse-on-surface) / <alpha-value>)",
        outline: "rgb(var(--outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
        "surface-tint": "rgb(var(--surface-tint) / <alpha-value>)",

        // Primary: Dynamic Violet
        primary: "rgb(var(--primary) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--on-primary-container) / <alpha-value>)",
        "inverse-primary": "rgb(var(--inverse-primary) / <alpha-value>)",
        "primary-fixed": "rgb(var(--primary-fixed) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--on-primary-fixed) / <alpha-value>)",
        "on-primary-fixed-variant": "rgb(var(--on-primary-fixed-variant) / <alpha-value>)",

        // Secondary: Dynamic Cyan / Teal Ocean
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
        "secondary-container": "rgb(var(--secondary-container) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--on-secondary-container) / <alpha-value>)",
        "secondary-fixed": "rgb(var(--secondary-fixed) / <alpha-value>)",
        "secondary-fixed-dim": "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
        "on-secondary-fixed": "rgb(var(--on-secondary-fixed) / <alpha-value>)",
        "on-secondary-fixed-variant": "rgb(var(--on-secondary-fixed-variant) / <alpha-value>)",

        // Tertiary: Dynamic Pink / Rose
        tertiary: "rgb(var(--tertiary) / <alpha-value>)",
        "on-tertiary": "rgb(var(--on-tertiary) / <alpha-value>)",
        "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",
        "on-tertiary-container": "rgb(var(--on-tertiary-container) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--tertiary-fixed) / <alpha-value>)",
        "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim) / <alpha-value>)",
        "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed) / <alpha-value>)",
        "on-tertiary-fixed-variant": "rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)",

        // Error
        error: "rgb(var(--error) / <alpha-value>)",
        "on-error": "rgb(var(--on-error) / <alpha-value>)",
        "error-container": "rgb(var(--error-container) / <alpha-value>)",
        "on-error-container": "rgb(var(--on-error-container) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "64px",
        gutter: "24px",
        "container-max": "1280px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        pulse: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 35s linear infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

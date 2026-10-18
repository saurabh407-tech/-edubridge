/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        warm: {
          50: "#FAF9F5",
          100: "#F5F3EC",
          200: "#EAE6DD",
          300: "#DDD6C7",
          400: "#C4BAA7",
          800: "#38332B",
          900: "#24201A",
        },
        brand: {
          sky: "#0ea5e9",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Manrope", "sans-serif"],
        heading: ["Manrope", "'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        "2xs": "0 1px 1px 0 rgba(26, 22, 18, 0.03)",
        xs: "0 1px 2px 0 rgba(26, 22, 18, 0.04)",
        card: "0 1px 3px 0 rgba(26, 22, 18, 0.04), 0 1px 2px -1px rgba(26, 22, 18, 0.03)",
        "card-hover": "0 12px 28px -4px rgba(37, 99, 235, 0.08), 0 4px 10px -2px rgba(26, 22, 18, 0.03)",
        elevated: "0 16px 36px -6px rgba(26, 22, 18, 0.08), 0 4px 12px -2px rgba(26, 22, 18, 0.03)",
        dropdown: "0 12px 30px -5px rgba(26, 22, 18, 0.1), 0 6px 10px -4px rgba(26, 22, 18, 0.04)",
        "brand-glow": "0 4px 16px 0 rgba(79, 70, 229, 0.22)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

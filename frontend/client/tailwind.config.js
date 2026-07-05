/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF9F6",
        ink: "#0B0B0A",
        charcoal: "#0E0E0D",
        stone: "#8A8580",
        hairline: "#E8E5DE",
        "hairline-dark": "#232320",
        gold: {
          DEFAULT: "#B08D57",
          light: "#C9A66B",
          dark: "#8F7043",
        },
        cream: "#F5F3EE",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.2em",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(11,11,10,0.06)",
        card: "0 4px 30px rgba(11,11,10,0.08)",
        lift: "0 12px 40px rgba(11,11,10,0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
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

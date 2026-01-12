import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["HK Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        obsidian: "hsl(var(--obsidian))",
        bone: "hsl(var(--bone))",
        charcoal: "hsl(var(--charcoal))",
        gold: "hsl(var(--gold))",
        steel: "hsl(var(--steel))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
          subtle: "hsl(var(--accent-subtle))",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          accent: "hsl(var(--ring-accent))",
          offset: "hsl(var(--ring-offset))",
        },
        active: {
          bg: "hsl(var(--active-bg))",
          border: "hsl(var(--active-border))",
          text: "hsl(var(--active-text))",
        },
        selected: {
          bg: "hsl(var(--selected-bg))",
          border: "hsl(var(--selected-border))",
          text: "hsl(var(--selected-text))",
          indicator: "hsl(var(--selected-indicator))",
        },
        link: {
          DEFAULT: "hsl(var(--link))",
          hover: {
            bg: "hsl(var(--link-hover-bg))",
            text: "hsl(var(--link-hover-text))",
            underline: "hsl(var(--link-hover-underline))",
          },
          visited: "hsl(var(--link-visited))",
        },
        rule: {
          DEFAULT: "hsl(var(--rule-default))",
          emphasis: "hsl(var(--rule-emphasis))",
        },
        marker: {
          active: "hsl(var(--marker-active))",
          dot: "hsl(var(--marker-dot))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "page-turn": {
          "0%": { transform: "perspective(1200px) rotateY(0deg)", opacity: "1" },
          "100%": { transform: "perspective(1200px) rotateY(-90deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "page-turn": "page-turn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 2s infinite linear",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer": "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.1), transparent)",
        "blue-shimmer": "linear-gradient(90deg, transparent, hsl(210 22% 24% / 0.08), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

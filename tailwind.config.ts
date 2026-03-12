import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      // pattern: /bg-chart-\d+(\/\d+)?/,
      pattern: /(bg|text)-chart-\d+(\/\d+)?/,
    },
    {
      pattern: /(bg|text)-rank-\d+(\/\d+)?/,
    },
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) / 2 )",
        sm: "calc(var(--radius) / 2 - .25rem)",
        xs: "calc(var(--radius) / 5)",
      },
      fontFamily: {
        sans: ["Futur Luxe", "Arial", "system-ui", "sans-serif"],
        // mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // "gray-300": "rgb(var(--gray-300))",
        // "gray-400": "rgb(var(--gray-400))",
        // "primary-dark": "hsl(var(--primary-dark))",
        // background: "hsl(var(--background))",
        // "background-secondary": "hsl(var(--card))",
        // "background-tertiary": "hsl(var(--muted))",
        // foreground: "hsl(var(--foreground))",
        // "text-primary": "hsl(var(--foreground))",
        // "card-group": "hsl(var(--card-group-bg))",
        // "symptoms-card-group": "rgb(var(--symptoms-card-background))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
          "muted-foreground": "rgb(var(--card-muted-foreground))",
          border: "rgb(var(--card-border))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          text: "rgb(var(--primary-text))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        border: "rgb(var(--border))",
        input: {
          DEFAULT: "rgb(var(--input))",
          autofill: "rgb(var(--input-autofill))",
        },
        grey: {
          "100": "rgb(var(--zinc-100))",
          "200": "rgb(var(--zinc-200))",
          "300": "rgb(var(--zinc-300))",
          "400": "rgb(var(--zinc-400))",
          "900": "rgb(var(--zinc-900))",
          "950": "rgb(var(--zinc-950))",
        },
        ring: "rgb(var(--ring))",
        logo: "rgb(var(--logo-color))",

        chart: {
          "0": "rgb(var(--chart-0))",
          "0-foreground": "rgb(var(--chart-0-foreground))",
          "1": "rgb(var(--chart-1))",
          "1-foreground": "rgb(var(--chart-1-foreground))",
          "2": "rgb(var(--chart-2))",
          "2-foreground": "rgb(var(--chart-2-foreground))",
          "3": "rgb(var(--chart-3))",
          "3-foreground": "rgb(var(--chart-3-foreground))",
          "4": "rgb(var(--chart-4))",
          "4-foreground": "rgb(var(--chart-4-foreground))",
          "5": "rgb(var(--chart-5))",
          "5-foreground": "rgb(var(--chart-5-foreground))",
          "6": "rgb(var(--chart-6))",
          "6-foreground": "rgb(var(--chart-6-foreground))",
        },
        rank: {
          "0": "rgb(var(--rating-rank-0))",
          "1": "rgb(var(--rating-rank-1))",
          "2": "rgb(var(--rating-rank-2))",
          "3": "rgb(var(--rating-rank-3))",
          "4": "rgb(var(--rating-rank-4))",
          "5": "rgb(var(--rating-rank-5))",
          "6": "rgb(var(--rating-rank-6))",
        },
        sidebar: {
          DEFAULT: "rgb(var(--sidebar-background))",
          foreground: "rgb(var(--sidebar-foreground))",
          primary: "rgb(var(--sidebar-primary))",
          "primary-foreground": "rgb(var(--sidebar-primary-foreground))",
          accent: "rgb(var(--sidebar-accent))",
          "accent-foreground": "rgb(var(--sidebar-accent-foreground))",
          border: "rgb(var(--sidebar-border))",
          ring: "rgb(var(--sidebar-ring))",
        },
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
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "spinner-leaf-fade": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spinner-leaf-fade": "spinner-leaf-fade 800ms linear infinite",

        // cubic-bezier.com
        // For the dialog component (mobile)
        "slide-in-from-bottom":
          "slide-in-from-bottom 0.3s cubic-bezier(.25,.45,.4,.95)",
        "slide-out-to-bottom":
          "slide-out-to-bottom 0.2s cubic-bezier(.5,.05,.7,.55)",
      },
    },
  },
  plugins: [],
} satisfies Config;

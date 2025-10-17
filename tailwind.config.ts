import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5%, 84%)",
        input: "hsl(240, 5%, 84%)",
        ring: "hsl(240, 5%, 84%)",
        background: "hsl(0, 0%, 98%)",
        foreground: "hsl(240, 10%, 4%)",
        primary: {
          DEFAULT: "hsl(240, 5%, 9%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(240, 5%, 96%)",
          foreground: "hsl(240, 10%, 4%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(240, 5%, 96%)",
          foreground: "hsl(240, 4%, 46%)",
        },
        accent: {
          DEFAULT: "hsl(240, 5%, 96%)",
          foreground: "hsl(240, 10%, 4%)",
        },
        popover: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 4%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 4%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    }
  },
  plugins: []
} satisfies Config;

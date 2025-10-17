import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5%, 84%)",
        background: "hsl(0, 0%, 98%)",
        foreground: "hsl(240, 10%, 4%)"
      }
    }
  },
  plugins: []
} satisfies Config;

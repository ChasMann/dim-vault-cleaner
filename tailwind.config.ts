/**
 * Tailwind configuration for the DIM Vault Toolkit UI theme.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/ui/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}", "./src/hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "panel": "#111827",
        "panel-border": "#1f2937",
        "panel-muted": "#0f172a",
        "accent": "#6366f1",
        "accent-hover": "#818cf8",
        "danger": "#f87171",
        "success": "#34d399"
      }
    }
  },
  plugins: []
};

export default config;

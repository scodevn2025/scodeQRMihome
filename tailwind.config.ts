
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-primary': '#00fff7',
        'cyber-secondary': '#ff00ff',
        'cyber-accent': '#00ff41',
        'cyber-warning': '#ffff00',
        'cyber-danger': '#ff0040',
        'cyber-dark': '#0a0a0a',
        'cyber-darker': '#050505',
        'cyber-gray': '#1a1a1a',
        'cyber-light-gray': '#2a2a2a',
        'cyber-text': '#e0e0e0',
        'cyber-text-dim': '#a0a0a0',
        background: "#10111a",
        foreground: "#e0eaff",
        card: "#181a24",
        'card-foreground': "#e0eaff",
        primary: "#00fff7",
        'primary-foreground': "#10111a",
        secondary: "#7f00ff",
        'secondary-foreground': "#fff",
        accent: "#ff00ff",
        'accent-foreground': "#fff",
        destructive: "#ff0040",
        'destructive-foreground': "#fff",
        border: "#00fff7",
        input: "#181a24",
        ring: "#00fff7",
      },
      fontFamily: {
        orbitron: [
          'Orbitron',
          'monospace'
        ],
        rajdhani: [
          'Rajdhani',
          'sans-serif'
        ]
      },
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.75rem",
      },
      boxShadow: {
        'cyberpunk-glow': '0 0 12px 2px #00fff7, 0 0 32px 4px #7f00ff33',
      },
      animation: {
        'cyberpunk-glow': 'cyberpunk-glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'glassmove': 'glassmove 8s ease-in-out infinite',
      },
      keyframes: {
        'cyberpunk-glow': {
          '0%': { boxShadow: '0 0 8px #00fff7, 0 0 24px #7f00ff33' },
          '50%': { boxShadow: '0 0 24px #7f00ff, 0 0 48px #00fff7' },
          '100%': { boxShadow: '0 0 8px #00fff7, 0 0 24px #7f00ff33' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glassmove': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;


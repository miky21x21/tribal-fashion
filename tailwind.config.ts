import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /*
       * === TRIBAL COLOR PALETTE ===
       * To customize the tribal color scheme, modify the values below.
       * These colors are used throughout the application for consistent theming.
       */
      colors: {
        "tribal-cream": "#fce29c",
        "tribal-dark-cream": "#fce29c",
        "tribal-red": "#9d2320",
        "tribal-red-accent": "#e63946",
        "tribal-dark": "#3b1c1c",
        "tribal-yellow": "#ffd166",
        "tribal-brown": "#ef362c",
        "tribal-green": "#3a5a40",
      },
      fontFamily: {
        kiner: ["'Kingthings Linear K'", "serif"],
        "homemade-apple": ["'Homemade Apple'", "cursive"],
        'monotype-corsiva': ['Monotype Corsiva', 'cursive'],
      },
      backgroundImage: {
        "tribal-striped":
          "linear-gradient(to bottom, #fce29c 0%, #fce29c 14%, #000000 14%, #000000 20%, #fce29c 20%, #fce29c 27%, #9d2320 27%, #9d2320 28%, #ffffff 28%, #ffffff 72%, #9d2320 72%, #9d2320 73%, #fce29c 73%, #fce29c 80%, #000000 80%, #000000 86%, #fce29c 86%, #fce29c 100%)",
        "tribal-gradient-cream": "linear-gradient(to bottom, #fce29c, #fce29c)",
        "tribal-gradient-red": "linear-gradient(to bottom, #9d2320, #e63946)",
        "tribal-gradient-warm": "linear-gradient(to bottom, #ffd166, #fce29c)",
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 1.5s ease-out forwards',
        'fade-slide-right': 'fadeSlideRight 1.5s ease-out forwards',
        'fade-slide-left': 'fadeSlideLeft 1.5s ease-out forwards',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        fadeSlideRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        fadeSlideLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
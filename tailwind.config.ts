import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  darkMode: ["selector", '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
      },
      colors: {
        skyfall: {
          50:"#ecf3ff",
          100:"#dae2f8",
          200:"#b5c3e7",
          300:"#8da1d7",
          400:"#6b85c9",
          500:"#5673c1",
          600:"#4a69bf",
          700:"#3a59a9",
          800:"#314f98",
          900:"#244488",
       }
     }
    },
  },
  plugins: [],
} satisfies Config;

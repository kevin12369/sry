import type { Config } from 'tailwindcss';
import { tokens } from './src/lib/tokens';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: tokens.color.paper,
        cream: tokens.color.cream,
        ink: tokens.color.ink,
        seal: tokens.color.seal,
        muted: tokens.color.muted,
        success: tokens.color.success,
        dark: tokens.color.dark,
      },
      fontFamily: {
        cjk: tokens.font.cjk.split(', '),
        latin: tokens.font.latin.split(', '),
      },
      boxShadow: {
        paper: tokens.shadow.paper,
        lifted: tokens.shadow.lifted,
      },
      borderRadius: {
        paper: tokens.radius.md,
      },
      transitionTimingFunction: {
        warm: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;

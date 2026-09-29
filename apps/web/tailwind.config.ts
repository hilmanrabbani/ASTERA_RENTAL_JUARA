import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        content: 'rgb(var(--text) / <alpha-value>)',
        muted:   'rgb(var(--muted) / <alpha-value>)',
        line:    'rgb(var(--border) / <alpha-value>)',
        gold:    'rgb(var(--gold) / <alpha-value>)',
        brand: {
          50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',
          400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',
          800:'#1e40af',900:'#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--gold) / .5), 0 0 24px -4px rgb(var(--gold) / .55)',
        card: '0 10px 40px -12px rgb(0 0 0 / .25)',
      },
      keyframes: {
        float:     { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-14px)'} },
        shimmer:   { '0%':{backgroundPosition:'-200% 0'}, '100%':{backgroundPosition:'200% 0'} },
        pulseRing: { '0%':{transform:'scale(.9)',opacity:'.7'}, '100%':{transform:'scale(1.6)',opacity:'0'} },
        gridMove:  { '0%':{backgroundPosition:'0 0'}, '100%':{backgroundPosition:'60px 60px'} },
      },
      animation: {
        float:     'float 6s ease-in-out infinite',
        shimmer:   'shimmer 2.5s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
        gridMove:  'gridMove 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

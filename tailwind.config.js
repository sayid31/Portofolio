/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#080808',
        surface: '#0f0f0f',
        card:    '#0d0d0d',
        fence:   '#1c1c1c',
        'fence-active': '#2a2a2a',
        ink:     '#f5f5f5',
        muted:   '#737373',
        dim:     '#525252',
        faint:   '#3a3a3a',
        accent:  '#10b981',
        'accent-tint':   'rgba(16,185,129,0.08)',
        'accent-border': 'rgba(16,185,129,0.2)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.03em',
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}

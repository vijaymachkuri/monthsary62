import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'love-pink': 'var(--color-love-pink)',
        'love-rose': 'var(--color-love-rose)',
        'love-lavender': 'var(--color-love-lavender)',
        'love-cream': 'var(--color-love-cream)',
        'love-gold': 'var(--color-love-gold)',
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
    content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
    theme: {
    extend: {
      colors: {
        background: '#ffffff', // hsl(0 0% 100%)
        foreground: '#0a0a0a', // hsl(0 0% 3.9%)
        card: {
          DEFAULT: '#ffffff', // hsl(0 0% 100%)
          foreground: '#0a0a0a' // hsl(0 0% 3.9%)
        },
        popover: {
          DEFAULT: '#ffffff', // hsl(0 0% 100%)
          foreground: '#0a0a0a' // hsl(0 0% 3.9%)
        },
        primary: {
          DEFAULT: '#181818', // hsl(0 0% 9%)
          foreground: '#fafafa' // hsl(0 0% 98%)
        },
        secondary: {
          DEFAULT: '#f5f5f5', // hsl(0 0% 96.1%)
          foreground: '#181818' // hsl(0 0% 9%)
        },
        muted: {
          DEFAULT: '#f5f5f5', // hsl(0 0% 96.1%)
          foreground: '#737373' // hsl(0 0% 45.1%)
        },
        accent: {
          DEFAULT: '#f5f5f5', // hsl(0 0% 96.1%)
          foreground: '#181818' // hsl(0 0% 9%)
        },
        destructive: {
          DEFAULT: '#ff4c4c', // hsl(0 84.2% 60.2%)
          foreground: '#fafafa' // hsl(0 0% 98%)
        },
        border: '#e5e5e5', // hsl(0 0% 89.8%)
        input: '#e5e5e5', // hsl(0 0% 89.8%)
        ring: '#0a0a0a', // hsl(0 0% 3.9%)
        chart: {
          '1': '#f2994a', // hsl(12 76% 61%)
          '2': '#269488', // hsl(173 58% 39%)
          '3': '#2b3a43', // hsl(197 37% 24%)
          '4': '#f7c873', // hsl(43 74% 66%)
          '5': '#ffb36a'  // hsl(27 87% 67%)
        },
        sidebar: {
          DEFAULT: '#eaeaff', // hsl(0 0% 98%)
          foreground: '#3e4250', // hsl(240 5.3% 26.1%)
          primary: '#191a1b', // hsl(240 5.9% 10%)
          'primary-foreground': '#fafafa', // hsl(0 0% 98%)
          accent: '#f6f7fa', // hsl(240 4.8% 95.9%)
          'accent-foreground': '#191a1b', // hsl(240 5.9% 10%)
          border: '#e6e9f0', // hsl(220 13% 91%)
          ring: '#3b82f6' // hsl(217.2 91.2% 59.8%)
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

/**
 * Tailwind CSS Configuration - MacBook Style Premium UI 2025
 * 
 * COLOR SCHEME (4 Colors):
 * - Primary: #52B2BF (Teal) - Main brand color, buttons, links
 * - Secondary: #8B5CF6 (Purple) - Accents, highlights, special features
 * - Accent: #F59E0B (Amber) - Warnings, stars, attention elements
 * - Success: #10B981 (Emerald) - Success states, positive indicators
 * 
 * @author HARSH J KUHIKAR
 * @copyright 2025 All Rights Reserved
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color - Teal (#52B2BF)
        primary: {
          50: '#f0fafb',
          100: '#d9f2f5',
          200: '#b8e6ec',
          300: '#87d4de',
          400: '#52B2BF',
          500: '#3a9aa8',
          600: '#2d7a87',
          700: '#28636e',
          800: '#26525b',
          900: '#24454d',
          950: '#122c33',
        },
        // Secondary color - Purple (#8B5CF6)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#a78bfa',
          500: '#8B5CF6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Accent color - Amber (#F59E0B)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F59E0B',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // Success color - Emerald (#10B981)
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Surface colors for cards and backgrounds
        surface: {
          50: '#ffffff',
          100: '#fafbfc',
          200: '#f4f6f8',
          300: '#e8ecf0',
          400: '#d1d9e0',
        },
        // Sidebar specific
        sidebar: {
          bg: '#ffffff',
          hover: '#f0fafb',
          active: '#e6f7f9',
          border: '#e5e7eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 6px 12px -2px rgba(0, 0, 0, 0.06), 0 3px 6px -3px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 20px -3px rgba(0, 0, 0, 0.07), 0 4px 8px -4px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 20px 40px -4px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.05)',
        'soft-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
        'button': '0 2px 4px rgba(82, 178, 191, 0.2), 0 4px 12px rgba(82, 178, 191, 0.15)',
        'button-hover': '0 4px 8px rgba(82, 178, 191, 0.25), 0 8px 20px rgba(82, 178, 191, 0.2)',
        'button-secondary': '0 2px 4px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(139, 92, 246, 0.15)',
        'glow': '0 0 20px rgba(82, 178, 191, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(82, 178, 191, 0.4)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        'sidebar': '4px 0 24px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'fade-in-down': 'fadeInDown 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'progress': 'progress 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #52B2BF 0%, #8B5CF6 100%)',
        'hero-gradient': 'linear-gradient(135deg, #52B2BF 0%, #8B5CF6 50%, #F59E0B 100%)',
      },
    },
  },
  plugins: [],
}

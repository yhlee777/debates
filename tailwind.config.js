/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 편안한 UI 색상 팔레트
        background: {
          main: '#FAFAF8',
          card: '#FFFFFF',
          accent: '#F5F5F0',
          hover: '#F0F0E8',
        },
        text: {
          title: '#2C2C2C',
          body: '#4A4A4A',
          muted: '#7A7A7A',
          placeholder: '#9A9A9A',
        },
        accent: {
          agree: '#6B9BD1',
          disagree: '#E8B88B',
          neutral: '#B8B8B8',
        },
        border: {
          DEFAULT: '#E8E8E8',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Noto Serif KR', 'Nanum Myeongjo', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.8' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.5' }],
        '4xl': ['2.25rem', { lineHeight: '1.4' }],
        '5xl': ['3rem', { lineHeight: '1.3' }],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'md': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'xl': '0 6px 20px rgba(0, 0, 0, 0.1)',
        'inner-sm': 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
        'inner-md': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'scale-in': 'scaleIn 300ms ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      maxWidth: {
        'readable': '680px',
        'container': '1200px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}

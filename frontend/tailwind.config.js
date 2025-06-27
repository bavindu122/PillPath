/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        accent: 'var(--color-accent)',
        'bg-light': 'var(--color-bg-light)',
        'text-dark': 'var(--color-text-dark)',
        'upload-bg': 'var(--color-upload-bg)',
        'upload-bg-hover': 'var(--color-upload-bg-hover)',
      },
      animation: {
        'float-slow': 'float-slow 15s ease-in-out infinite',
        'float-delay': 'float-delay 12s ease-in-out infinite',
        'spin-slow': 'spin-slow 30s linear infinite',
        'pulse-slow': 'pulse-slow 8s infinite'
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'med-pattern': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M8 0a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H1a1 1 0 110-2h6V1a1 1 0 011-1z\"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')"
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
        'button-glow': '0 0 15px rgba(45, 93, 160, 0.5)',
      },
      dropShadow: {
        'lg-blue': '0 0 8px rgba(45, 93, 160, 0.4)',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B5AE1',
        'primary-hover': '#244fc1',
        'text-dark': '#0B132A',
        'text-gray': '#6B7280',
        'gradient-start': '#7DB9E8',
        'gradient-end': '#0D6EFD',
        'dashboard-start': '#8ED0FF',
        'dashboard-end': '#0B4E9B',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'md': '12px',
      }
    },
  },
  plugins: [],
}
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
        primary: {
          light: '#4a5568',
          DEFAULT: '#2d3748',
          dark: '#1a202c',
        },
        secondary: {
          light: '#2b6cb0',
          DEFAULT: '#2c5282',
          dark: '#2a4365',
        },
      },
    },
  },
  plugins: [],
}
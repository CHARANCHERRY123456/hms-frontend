/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",    // for Next.js 13 app directory
    "./src/pages/**/*.{js,ts,jsx,tsx}",  // for Next.js pages
    "./src/components/**/*.{js,ts,jsx,tsx}", // for your components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Add this line to exclude specific files or folders
  purge: {
    content: [
      "./src/**/*.{jsx,ts,tsx}",
      // Add paths to files or folders you want to exclude
      "!./src/components/componentToExclude.jsx",
      "!./src/pages/**/*.{jsx,ts,tsx}",
    ],
  },
  plugins: [],
}

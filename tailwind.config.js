/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [],
  theme: {
    extend: {
      gridTemplateColumns: {
        todo: "48px, auto, 120px, 200px, 60px"
      }
    }
  }
}

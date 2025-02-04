/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        title:["Sixtyfour", "serif"],
        frijole:[ "Frijole", "serif"],
        bentham:[ "Bentham", "serif"],
        Merriweather: ["Merriweather", "serif"]
      },
      colors: {
        'custom-dark': 'rgba(25,73,93,1)',
        'radio-yellow': 'rgb(234 216 106)',
      }
    },
  },
  plugins: [],
}


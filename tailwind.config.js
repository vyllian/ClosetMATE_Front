/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        philosopher : ["Philosopher-Regular","serif"],
        "philosopher-bold" : ["Philosopher-Bold","serif"],
        anticdidone : ["Antic-Didone-Regular","serif"],
        limelight : ["Limelight-Regular","serif"],
      },
      colors:{
        primary:{
          DEFAULT:'#FFDCEF'
        },
        accent:{
          100:'#FB3F4A',
        },
        black:{
          DEFAULT:'#000000',
          100:'#636363',
          200:'#828282',
          300:'#D9D9D9',
        },
        danger: '#BC4444'
      }
    },
  },
  plugins: [],
}


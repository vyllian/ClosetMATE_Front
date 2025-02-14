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
          100:'#0061FF0A',
          200:'#0061FF1A',
          300:'#0061FF',
        },
        accent:{
          100:'#FBFBFD',
        },
        black:{
          DEFAULT:'#000000',
          100:'#8C8E98',
          200:'#666876',
          300:'#1911D31',
        },
        danger: '#F75555'
      }
    },
  },
  plugins: [],
}


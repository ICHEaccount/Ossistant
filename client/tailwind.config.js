/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        'dark-navy':"#132043",
        'navy':"#1F4172",
        'peach':"#F1B4BB",
        'bright-peach':"#FDF0F0"
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
}


const Color = require('color')

const transitionDuration = '.333s'

const colors = {
  white: '#f3f2f2',
  red: '#FF5C40',
  orange: '#FAA82F',
  yellow: '#FAD600',
  green: '#8DCC29',
  cyan: '#5BBAE8',
  blue: '#5587D9',
  grey: '#999898',
  gray: '#999898',
  black: '#232222'
}

// generate light / dark values
const caclcColors = colors => {
  const calcColors = colors
  Object.keys(colors).map(key => {
    calcColors[key] = {
      100: String(
        Color(colors[key])
          .lighten(0.5)
          .hex()
      ).replace('0x', '#'),
      200: String(
        Color(colors[key])
          .lighten(0.375)
          .hex()
      ).replace('0x', '#'),
      300: String(
        Color(colors[key])
          .lighten(0.25)
          .hex()
      ).replace('0x', '#'),
      400: String(
        Color(colors[key])
          .lighten(0.125)
          .hex()
      ).replace('0x', '#'),
      default: String(Color(colors[key]).hex()).replace('0x', '#'),
      500: String(Color(colors[key]).hex()).replace('0x', '#'),
      600: String(
        Color(colors[key])
          .darken(0.125)
          .hex()
      ).replace('0x', '#'),
      700: String(
        Color(colors[key])
          .darken(0.25)
          .hex()
      ).replace('0x', '#'),
      800: String(
        Color(colors[key])
          .darken(0.375)
          .hex()
      ).replace('0x', '#'),
      900: String(
        Color(colors[key])
          .darken(0.5)
          .hex()
      ).replace('0x', '#')
    }
  })
  return calcColors
}

module.exports = {
  // important: true,
  theme: {
    screens: {
      sm: '600px',
      md: '800px',
      lg: '1200px',
      xl: '1600px',
      hd: '1920px',
      '4k': '3840px'
    },
    fontFamily: {
      sans: ['Barlow', 'sans-serif']
    },
    borderRadius: {
      default: '2px'
    },
    letterSpacing: {
      '-1': '-0.056rem',
      '-2': '-0.111rem',
      '-3': '-0.167rem',
      '0': '0px',
      '1': '0.056rem',
      '2': '0.111rem',
      '3': '0.167rem'
    },
    minHeight: {
      '1/2-screen': '50vh',
      screen: '100vh'
    },
    extend: {
      // fontWeight: {

      // },
      colors: caclcColors(colors),
      height: {
        divider: '.2rem'
      },
      lineHeight: {
        tighter: '1.111',
        tight: '1.333',
        normal: '1.666'
      },
      width: {
        '2/5': '40%',
        '3/5': '60%',
        '3/7': '43%',
        '4/7': '57%'
      },
      margin: {
        '96': '24rem',
        '128': '32rem'
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'group-hover'],
    opacity: ['responsive', 'hover']
  },
  plugins: [
    require('tailwindcss-transition')({
      standard: `all ${transitionDuration} ease`,
      transitions: {
        slow: 'all 2s ease',
        'normal-in-out-quad': 'all 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        'slow-in-out-quad': 'all 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)'
      }
    })
  ]
}

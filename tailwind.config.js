const Color = require('color');

// colors
const baseColors = {
  white: '#f3f2f2',
  purple: '#41204d',
  gray: '#e2e2d6',
  black: '#333333',
};

// generate light / dark values
const caclcColors = colors => {
  const calcColors = colors;
  Object.keys(colors).map(key => {
    calcColors[key] = {
      100: String(Color(colors[key]).lighten(0.5).hex()).replace('0x', '#'),
      200: String(Color(colors[key]).lighten(0.375).hex()).replace('0x', '#'),
      light: String(Color(colors[key]).lighten(0.375).hex()).replace('0x', '#'),
      300: String(Color(colors[key]).lighten(0.25).hex()).replace('0x', '#'),
      400: String(Color(colors[key]).lighten(0.125).hex()).replace('0x', '#'),
      DEFAULT: String(Color(colors[key]).hex()).replace('0x', '#'),
      500: String(Color(colors[key]).hex()).replace('0x', '#'),
      600: String(
        Color(colors[key]).darken(0.125).saturate(0.125).hex()
      ).replace('0x', '#'),
      700: String(
        Color(colors[key]).darken(0.25).saturate(0.125).hex()
      ).replace('0x', '#'),
      dark: String(
        Color(colors[key]).darken(0.375).saturate(0.125).hex()
      ).replace('0x', '#'),
      800: String(
        Color(colors[key]).darken(0.375).saturate(0.125).hex()
      ).replace('0x', '#'),
      900: String(Color(colors[key]).darken(0.5).saturate(0.125).hex()).replace(
        '0x',
        '#'
      ),
    };
  });
  return calcColors;
};

const colors = caclcColors(baseColors);

module.exports = {
  mode: 'jit',
  content: ['./components/**/*.vue', './pages/**/*.vue', './layouts/**/*.vue'],
  theme: {
    screens: {
      sm: '650px',
      md: '850px',
      lg: '1200px',
      xl: '1600px',
      hd: '1920px',
      '4k': '3840px',
    },
    fontFamily: {
      sans: ['Gotham SSm A', 'sans-serif'],
    },
    letterSpacing: {
      '-1': '-0.056rem',
      '-2': '-0.111rem',
      '-3': '-0.167rem',
      0: '0px',
      1: '0.056rem',
      2: '0.111rem',
      3: '0.167rem',
    },
    minHeight: {
      'hero-sm': '20rem',
      'hero-md': '30rem',
      'hero-lg': '40rem',
      '1/3-screen': '33vh',
      '1/2-screen': '50vh',
      screen: '100vh',
    },
    extend: {
      colors: { ...colors, primary: colors.purple['500'] },
      fill: theme => theme('colors'),
      fontSize: {
        xxs: '.625rem',
        xs: '.75rem',
        sm: '.865rem',
        md: '1rem',
        base: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
        '5xl': '5rem',
        '6xl': '6rem',
        '7xl': '7rem',
        '8xl': '8rem',
        '9xl': '9rem',
        '10xl': '10rem',
        inherit: 'inherit',
      },
      borderRadius: {
        DEFAULT: '2px',
      },
      height: {
        divider: '.2rem',
      },
      lineHeight: {
        tighter: '1.111',
        tight: '1.333',
        medium: '1.45',
        normal: '1.666',
        loose: '2',
        looser: '2.666',
      },
      maxWidth: {
        64: '16rem',
        '8xl': '88rem',
      },
      width: {
        '1/8': `${(1 / 8) * 100}%`,
        '2/5': '40%',
        '3/5': '60%',
        '3/7': '43%',
        '4/7': '57%',
      },
      margin: {
        96: '24rem',
        128: '32rem',
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'group-hover'],
    opacity: ['responsive', 'hover', 'group-hover'],
    width: ['responsive', 'hover', 'group-hover'],
  },
};

const COLORS = {
  primary: '#b90101',
  secondary: '#444262',
  tertiary: '#FF7754',

  gray: '#83829A',
  gray2: '#C1C0C8',
  gray3: '#dad9dc',

  white: '#F3F4F8',
  lightWhite: '#FAFAFC',

  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  orange: '#ff8000',

  link: '#0000ff',

  locationNotification: '#b90101',

  toggleOn: 'green',
  toggleOff: 'red',

  toggleThumbOn: '#d2d2d2',
  toggleThumbOff: '#f4f3f4',

  backgroung: 'gainsboro',
  modalBackground: 'rgba(0,0,0,0.3)',

  unset: 'unset',
};

const FONT = {
  regular: 'DMRegular',
  medium: 'DMMedium',
  bold: 'DMBold',
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d1117', // Color oscuro principal (ACTUALIZADO)
        secondary: '#e6c200', // Amarillo dorado (ACTUALIZADO)
        alternative: '#487294', // Azul medio
        dark: '#0d1117', // Color oscuro (ACTUALIZADO)
        'dark-alt': '#06090f', // Color más oscuro (NUEVO)
        gray: '#A3A7AD', // Gris medio
        white: '#FFFFFF', // Blanco
        blue: '#487294', // Azul medio
        cream: '#FAF6E9', // Crema claro
        'cream-soft': '#FAF6E9', // Variante suave
        brown: '#955E39', // Marrón medio
        'dark-brown': '#624332', // Marrón oscuro
        yellow: '#e6c200', // Amarillo dorado (ACTUALIZADO)
        'yellow-dark': '#d4b000', // Amarillo oscuro (NUEVO)
      },
      textColor: {
        primary: '#0d1117',
        secondary: '#e6c200',
        alternative: '#487294',
        dark: '#0d1117',
        'dark-alt': '#06090f',
        gray: '#A3A7AD',
        white: '#FFFFFF',
        blue: '#487294',
        cream: '#FAF6E9',
        brown: '#955E39',
        'dark-brown': '#624332',
        yellow: '#e6c200',
        'yellow-dark': '#d4b000',
      },
      backgroundColor: {
        primary: '#0d1117',
        secondary: '#e6c200',
        alternative: '#487294',
        dark: '#0d1117',
        'dark-alt': '#06090f',
        gray: '#A3A7AD',
        white: '#FFFFFF',
        blue: '#487294',
        cream: '#FAF6E9',
        'cream-soft': '#FAF6E9',
        brown: '#955E39',
        'dark-brown': '#624332',
        yellow: '#e6c200',
        'yellow-dark': '#d4b000',
        footer: '#0d1117',
      },
      borderColor: {
        primary: '#0d1117',
        secondary: '#e6c200',
        yellow: '#e6c200',
        'yellow-dark': '#d4b000',
      },
      height: {
        '2xl': '28rem',
        '3xl': '30rem',
        '4xl': '33rem',
        '4xh': '85vh',
      },
      width: {},

      inset: { 99: '32rem' },

      keyframes: {
        slidein: {
          from: {
            opacity: '0',
            transfom: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transfom: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: 0,
            transform: 'translate3d(0, 10%, 0)',
          },
          '100%': {
            opacity: 1,
            transform: 'translate3d(0, 50, 0)',
          },
        },
        'fade-out-left': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
            transform: 'translate3d(-100%, 0, 0)',
          },
        },
      },
      animation: {
        slidein: 'slidein 2s ease var(--slidein-delay, 0) forwards',
        fadein: 'fade-in 3s ease-in-out 0.15s 1',
        fadeinup: 'fade-in-up 2s ease-in-out 0.35s 1 forwards',
        fadeoutleft: 'fade-out-left 1s ease-in-out 0.25s 1 forwards',
      },
    },

    screens: {
      xs: '380px',
      ...require('tailwindcss/defaultTheme').screens,
      '3xl': '120rem',
      ...require('tailwindcss/defaultTheme').screens,
    },
  },
  variants: {
    extend: {
      display: ['hover', 'focus'],
    },
  },
  plugins: [],
};

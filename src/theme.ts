import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

// ─── Brand colors ────────────────────────────────────────────────────────

const YELLOW = '#ffda1a'
const YELLOW_HOVER = '#f5c800'
const YELLOW_ACTIVE = '#e6b800'
const BLUE = '#0058a3'
const DARK_BLUE = '#003e74'
const BLACK = '#111111'

// ─── Preset ───────────────────────────────────────────────────────────────────

export const BrandPreset = definePreset(Aura, {
  semantic: {
    // Map PrimeVue's "primary" colour tokens to Brand blue
    // (used for focus rings, outlined variants, text variants, links, etc.)
    primary: {
      50: '#e6f0f9',
      100: '#cce1f4',
      200: '#99c3e9',
      300: '#66a5de',
      400: '#3387d3',
      500: BLUE,
      600: '#004d8f',
      700: DARK_BLUE,
      800: '#002d54',
      900: '#001a31',
      950: '#000d19',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.900}',
        },
      },
      dark: {
        primary: {
          color: '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.900}',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            // Primary button → Brand yellow with black text
            primary: {
              background: YELLOW,
              hoverBackground: YELLOW_HOVER,
              activeBackground: YELLOW_ACTIVE,
              borderColor: YELLOW,
              hoverBorderColor: YELLOW_HOVER,
              activeBorderColor: YELLOW_ACTIVE,
              color: BLACK,
              hoverColor: BLACK,
              activeColor: BLACK,
              focusRing: { color: BLUE, shadow: 'none' },
            },
          },
        },
        dark: {
          root: {
            primary: {
              background: YELLOW,
              hoverBackground: YELLOW_HOVER,
              activeBackground: YELLOW_ACTIVE,
              borderColor: YELLOW,
              hoverBorderColor: YELLOW_HOVER,
              activeBorderColor: YELLOW_ACTIVE,
              color: BLACK,
              hoverColor: BLACK,
              activeColor: BLACK,
              focusRing: { color: BLUE, shadow: 'none' },
            },
          },
        },
      },
    },
  },
})

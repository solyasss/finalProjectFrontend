import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const foundationPalette = {
  blue: {
    50: '#e6f0f9',
    100: '#cce1f4',
    200: '#99c3e9',
    300: '#66a5de',
    400: '#3387d3',
    500: '#0058a3',
    600: '#004d8f',
    700: '#003e74',
    800: '#002d54',
    900: '#001a31',
    950: '#000d19',
  },
  accent: {
    500: '#8ea9a8',
    600: '#809998',
    700: '#728887',
  },
  neutral: {
    0: '#ffffff',
    50: '#fffefb',
    100: '#f5f5f5',
    300: '#dfdfdf',
    500: '#767676',
    700: '#484848',
    900: '#111111',
  },
  status: {
    error: '#e00751',
    success: '#168733',
    warning: '#f26a2f',
  },
  promo: {
    badge: '#8ea9a8',
  },
} as const

export const themeColors = {
  brand: {
    primary: foundationPalette.blue[500],
    primaryHover: foundationPalette.blue[700],
    primaryActive: foundationPalette.blue[900],
  },
  action: {
    cta: foundationPalette.accent[500],
    ctaHover: foundationPalette.accent[600],
    ctaActive: foundationPalette.accent[700],
  },
  text: {
    primary: foundationPalette.neutral[900],
    secondary: foundationPalette.neutral[700],
    muted: foundationPalette.neutral[500],
    inverse: foundationPalette.neutral[0],
  },
  surface: {
    canvas: foundationPalette.neutral[0],
    subtle: foundationPalette.neutral[50],
    muted: foundationPalette.neutral[100],
    border: foundationPalette.neutral[300],
  },
  feedback: foundationPalette.status,
  accent: {
    promoBadge: foundationPalette.promo.badge,
  },
} as const

export const appThemeCssVariables = {
  '--app-color-brand-primary': themeColors.brand.primary,
  '--app-color-brand-primary-hover': themeColors.brand.primaryHover,
  '--app-color-brand-primary-active': themeColors.brand.primaryActive,
  '--app-color-action-cta': themeColors.action.cta,
  '--app-color-action-cta-hover': themeColors.action.ctaHover,
  '--app-color-action-cta-active': themeColors.action.ctaActive,
  '--app-color-text-primary': themeColors.text.primary,
  '--app-color-text-secondary': themeColors.text.secondary,
  '--app-color-text-muted': themeColors.text.muted,
  '--app-color-text-inverse': themeColors.text.inverse,
  '--app-color-surface-canvas': themeColors.surface.canvas,
  '--app-color-surface-subtle': themeColors.surface.subtle,
  '--app-color-surface-muted': themeColors.surface.muted,
  '--app-color-border-subtle': themeColors.surface.border,
  '--app-color-feedback-error': themeColors.feedback.error,
  '--app-color-feedback-success': themeColors.feedback.success,
  '--app-color-feedback-warning': themeColors.feedback.warning,
  '--app-color-accent-promo-badge': themeColors.accent.promoBadge,
} as const

interface CssVariableTarget {
  style: {
    setProperty: (name: string, value: string) => void
  }
}

function resolveDefaultCssVariableTarget(): CssVariableTarget | undefined {
  if (typeof globalThis !== 'object' || !('document' in globalThis)) {
    return undefined
  }

  const { document } = globalThis as {
    document?: { documentElement?: CssVariableTarget }
  }

  return document?.documentElement
}

export function installAppThemeVariables(
  target: CssVariableTarget | undefined = resolveDefaultCssVariableTarget(),
) {
  if (!target) return

  for (const [name, value] of Object.entries(appThemeCssVariables)) {
    target.style.setProperty(name, value)
  }
}

// ─── Preset ───────────────────────────────────────────────────────────────────

export const BrandPreset = definePreset(Aura, {
  semantic: {
    // Map PrimeVue's "primary" colour tokens to Brand blue
    // (used for focus rings, outlined variants, text variants, links, etc.)
    primary: {
      ...foundationPalette.blue,
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          inverseColor: themeColors.text.inverse,
          hoverColor: '{primary.700}',
          activeColor: '{primary.900}',
        },
      },
      dark: {
        primary: {
          color: '{primary.500}',
          inverseColor: themeColors.text.inverse,
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
            // Primary button → CTA color with black text
            primary: {
              background: themeColors.action.cta,
              hoverBackground: themeColors.action.ctaHover,
              activeBackground: themeColors.action.ctaActive,
              borderColor: themeColors.action.cta,
              hoverBorderColor: themeColors.action.ctaHover,
              activeBorderColor: themeColors.action.ctaActive,
              color: themeColors.text.primary,
              hoverColor: themeColors.text.primary,
              activeColor: themeColors.text.primary,
              focusRing: {
                color: themeColors.brand.primary,
                shadow: '0 0 0 2px #fff, 0 0 0 4px var(--p-primary-color)',
              },
            },
          },
        },
        dark: {
          root: {
            primary: {
              background: themeColors.action.cta,
              hoverBackground: themeColors.action.ctaHover,
              activeBackground: themeColors.action.ctaActive,
              borderColor: themeColors.action.cta,
              hoverBorderColor: themeColors.action.ctaHover,
              activeBorderColor: themeColors.action.ctaActive,
              color: themeColors.text.primary,
              hoverColor: themeColors.text.primary,
              activeColor: themeColors.text.primary,
              focusRing: {
                color: themeColors.brand.primary,
                shadow: '0 0 0 2px #fff, 0 0 0 4px var(--p-primary-color)',
              },
            },
          },
        },
      },
    },
  },
})

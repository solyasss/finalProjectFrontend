import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { withThemeByClassName } from '@storybook/addon-themes'
import PrimeVue from 'primevue/config'
import { BrandPreset } from '../src/theme'

import '../src/assets/main.css'

// Register PrimeVue globally so all stories can use PrimeVue components
setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: BrandPreset,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
})

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview

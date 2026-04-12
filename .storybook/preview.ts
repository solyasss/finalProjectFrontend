import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { withThemeByClassName } from '@storybook/addon-themes'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createMemoryHistory, createRouter } from 'vue-router'
import { i18n } from '../src/i18n'
import { BrandPreset } from '../src/theme'

import '../src/assets/main.css'

// Register PrimeVue globally so all stories can use PrimeVue components
setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/cat/:categorySlug', name: 'plp', component: { template: '<div />' } },
      { path: '/p/:productSlug', name: 'pdp', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
    ],
  })

  app.use(createPinia())
  app.use(router)
  app.use(i18n)
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

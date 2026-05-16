import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { BrandPreset, installAppThemeVariables } from './theme'
import { setUnauthorizedHandler } from '@/api'
import { i18n } from '@/i18n'
import { useAuthStore } from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

installAppThemeVariables()

app.use(pinia)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: BrandPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})

function buildUnauthorizedRedirectQuery(): Record<string, string> | undefined {
  const currentRoute = router.currentRoute.value

  if (currentRoute.name === 'login') {
    return undefined
  }

  if (
    currentRoute.meta.requiresAuth ||
    currentRoute.meta.requiresAdmin ||
    currentRoute.path.startsWith('/admin')
  ) {
    return { redirect: currentRoute.fullPath }
  }

  return undefined
}

// Redirect to login on unrecoverable 401.
setUnauthorizedHandler(() => {
  const currentRoute = router.currentRoute.value

  if (currentRoute.name === 'login') {
    return
  }

  router.push({ name: 'login', query: buildUnauthorizedRedirectQuery() })
})

// Restore session
const authStore = useAuthStore()
await authStore.initialize()

app.use(router)
await router.isReady()

app.mount('#app')

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { BrandPreset } from './theme'
import { setUnauthorizedHandler } from '@/api'
import { i18n } from '@/i18n'
import { useAuthStore } from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

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

// Redirect to login on unrecoverable 401.
setUnauthorizedHandler(() => {
  router.push({ name: 'login' })
})

// Restore session
const authStore = useAuthStore()
await authStore.initialize()

app.use(router)
await router.isReady()

app.mount('#app')

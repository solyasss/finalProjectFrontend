import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { BrandPreset } from './theme'
import { setUnauthorizedHandler } from '@/api'
import { useAuthStore } from '@/stores'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
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

// Redirect to home on unrecoverable 401.
// TODO: replace with login route once /login is added to the router.
setUnauthorizedHandler(() => {
  router.push({ name: 'home' })
})

// Restore session
const authStore = useAuthStore()
await authStore.initialize()

app.mount('#app')

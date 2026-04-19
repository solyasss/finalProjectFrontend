<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import HamburgerMenu from '@/components/organisms/HamburgerMenu/HamburgerMenu.vue'
import HeaderCategoryMenu from '@/components/organisms/HeaderCategoryMenu/HeaderCategoryMenu.vue'
import LocationPicker from '@/components/organisms/LocationPicker/LocationPicker.vue'
import { useLocationPicker } from '@/composables/useLocationPicker'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)
const locationPickerRef = ref<InstanceType<typeof LocationPicker> | null>(null)
const {
  query,
  filteredCities,
  currentLabel,
  detecting,
  errorKey,
  runAutoDetectionOnLoad,
  requestCurrentLocation,
  selectCity,
} = useLocationPicker()

onMounted(() => {
  runAutoDetectionOnLoad()
})

function toggleLocale() {
  const next = locale.value === 'uk' ? 'en' : 'uk'
  locale.value = next
  localStorage.setItem('locale', next)
}

const menuItems = computed(() => [
  {
    id: 'location',
    label: t('header.locationMenuLabel'),
    description: currentLabel.value,
    icon: 'pi pi-map-marker',
  },
  { id: 'products', label: t('header.nav.products'), icon: 'pi pi-box' },
  { id: 'rooms', label: t('header.nav.rooms'), icon: 'pi pi-home' },
  { id: 'design', label: t('header.nav.design'), icon: 'pi pi-palette' },
])

const navItems = computed(() => [
  { label: t('header.nav.products'), to: { name: 'plp', params: { categorySlug: 'living-room' } } },
  { label: t('header.nav.rooms'), to: { name: 'plp', params: { categorySlug: 'bedroom' } } },
  { label: t('header.nav.design'), to: { name: 'plp', params: { categorySlug: 'lighting' } } },
])

function handleMenuSelect(item: { id: string }) {
  if (item.id === 'location') {
    locationPickerRef.value?.openChooser()
    return
  }

  if (item.id === 'products') {
    router.push({ name: 'plp', params: { categorySlug: 'living-room' } })
    menuOpen.value = false
    return
  }

  if (item.id === 'rooms') {
    router.push({ name: 'plp', params: { categorySlug: 'bedroom' } })
    menuOpen.value = false
    return
  }

  if (item.id === 'design') {
    router.push({ name: 'plp', params: { categorySlug: 'lighting' } })
    menuOpen.value = false
  }
}
</script>

<template>
  <header class="bg-surface-0 border-b border-surface md:sticky top-0 z-50">
    <div class="flex min-h-18 items-center justify-between gap-4 px-3 md:px-6 lg:px-12">
      <div class="flex min-w-0 items-center gap-4 md:gap-6 lg:gap-8">
        <div class="md:hidden">
          <HamburgerMenu
            v-model:open="menuOpen"
            :items="menuItems"
            :aria-label="t('header.menuAriaLabel')"
            :title="t('header.menuTitle')"
            @select="handleMenuSelect"
          />
        </div>

        <RouterLink
          to="/"
          class="text-color flex h-10 items-center text-[2.25rem] font-bold leading-none no-underline"
          :aria-label="t('header.logoAriaLabel')"
        >
          BN
        </RouterLink>

        <nav class="hidden items-center gap-6 md:flex" :aria-label="t('header.navAriaLabel')">
          <RouterLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            class="text-muted-color hover:text-color text-sm font-medium no-underline transition-colors"
          >
            {{ item.label }}
          </RouterLink>

          <HeaderCategoryMenu />
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-1 md:gap-2">
        <LocationPicker
          class="hidden md:block"
          ref="locationPickerRef"
          :current-label="currentLabel"
          :query="query"
          :cities="filteredCities"
          :detecting="detecting"
          :error-key="errorKey"
          @update:query="query = $event"
          @retry-detect="requestCurrentLocation('auto')"
          @select-city="selectCity($event, 'manual')"
        />

        <RouterLink v-if="!authStore.isAuthenticated" to="/register" class="no-underline">
          <Button
            type="button"
            text
            :aria-label="t('header.accountAriaLabel')"
            :pt="{
              root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
            }"
          >
            <span class="text-muted-color flex items-center gap-2 text-sm">
              <i class="pi pi-user text-base" aria-hidden="true" />
              <span class="hidden md:inline">{{ t('header.accountLabel') }}</span>
            </span>
          </Button>
        </RouterLink>

        <RouterLink
          v-else
          to="/account"
          class="no-underline"
          :aria-label="t('header.accountAriaLabel')"
        >
          <Button
            type="button"
            text
            :aria-label="t('header.accountAriaLabel')"
            :pt="{
              root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
            }"
          >
            <span
              class="text-muted-color flex items-center gap-2 text-sm transition-colors hover:text-color"
            >
              <i class="pi pi-user text-base" aria-hidden="true" />
              <span class="hidden md:inline">{{
                t('header.accountGreeting', { name: authStore.firstName })
              }}</span>
            </span>
          </Button>
        </RouterLink>

        <RouterLink to="/cart" class="no-underline" :aria-label="t('header.cartAriaLabel')">
          <Button
            type="button"
            text
            :aria-label="t('header.cartAriaLabel')"
            :pt="{
              root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
            }"
          >
            <i class="pi pi-shopping-bag text-muted-color text-base" aria-hidden="true" />
          </Button>
        </RouterLink>

        <RouterLink
          to="/favorites"
          class="no-underline"
          :aria-label="t('header.favoritesAriaLabel')"
        >
          <Button
            type="button"
            text
            :aria-label="t('header.favoritesAriaLabel')"
            :pt="{
              root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
            }"
          >
            <i class="pi pi-heart text-muted-color text-base" aria-hidden="true" />
          </Button>
        </RouterLink>

        <Button
          type="button"
          text
          :aria-label="t('header.languageAriaLabel')"
          :pt="{
            root: { style: { border: 'none', color: 'var(--p-text-muted-color)' } },
          }"
          @click="toggleLocale"
        >
          <span class="text-muted-color text-xs font-semibold uppercase tracking-wide">
            {{ locale === 'uk' ? 'EN' : 'UK' }}
          </span>
        </Button>
      </div>
    </div>
  </header>
</template>

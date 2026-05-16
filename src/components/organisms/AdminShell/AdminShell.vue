<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AdminSidebarNav from '@/components/organisms/AdminSidebarNav/AdminSidebarNav.vue'
import type { AdminNavItem } from '@/composables/useAdminNavigation'

interface Props {
  eyebrow: string
  title: string
  description: string
  items: AdminNavItem[]
  activeItemId: AdminNavItem['id']
}

defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
    <header class="space-y-3">
      <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">{{ eyebrow }}</p>
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-color md:text-3xl">{{ title }}</h1>
        <p class="max-w-3xl text-sm leading-6 text-muted-color md:text-base">{{ description }}</p>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <AdminSidebarNav
          :items="items"
          :active-item-id="activeItemId"
          :ariaLabel="t('admin.navAriaLabel')"
        />
      </aside>

      <div class="grid gap-5">
        <slot />
      </div>
    </div>
  </section>
</template>

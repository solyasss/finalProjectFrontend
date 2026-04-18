<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AccountSidebarNav from '@/components/organisms/AccountSidebarNav/AccountSidebarNav.vue'
import type { AccountNavItem } from '@/composables/useAccountSections'

interface Props {
  eyebrow: string
  title: string
  description: string
  items: AccountNavItem[]
  activeItemId: AccountNavItem['id']
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', value: AccountNavItem['id']): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
    <header class="space-y-3">
      <p class="text-sm font-bold uppercase tracking-[0.16em] text-muted-color">{{ eyebrow }}</p>
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-color md:text-3xl">{{ title }}</h1>
        <p class="max-w-3xl text-sm leading-6 text-muted-color md:text-base">
          {{ description }}
        </p>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <AccountSidebarNav
          :items="items"
          :active-item-id="activeItemId"
          :ariaLabel="t('accountPage.navAriaLabel')"
          @select="emit('select', $event)"
        />
      </aside>

      <div class="grid gap-5">
        <slot />
      </div>
    </div>
  </section>
</template>

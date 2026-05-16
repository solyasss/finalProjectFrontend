<script setup lang="ts">
import type { AdminNavItem } from '@/composables/useAdminNavigation'

interface Props {
  items: AdminNavItem[]
  activeItemId: AdminNavItem['id']
  ariaLabel: string
}

defineProps<Props>()
</script>

<template>
  <nav :aria-label="ariaLabel" class="grid gap-2">
    <RouterLink
      v-for="item in items"
      :key="item.id"
      :to="{ name: item.routeName }"
      class="flex min-h-14 items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left no-underline transition-colors"
      :class="
        item.id === activeItemId
          ? 'border-surface bg-highlight text-color'
          : 'border-surface bg-surface-0 text-muted-color hover:bg-emphasis hover:text-color'
      "
    >
      <span class="grid gap-1">
        <span class="text-sm font-semibold">{{ item.label }}</span>
        <span class="text-xs leading-5 text-muted-color">{{ item.description }}</span>
      </span>

      <span class="flex items-center gap-2">
        <span
          v-if="item.availability === 'deferred'"
          class="rounded-full border border-surface px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-color"
        >
          {{ $t('admin.labels.deferred') }}
        </span>
        <i v-if="item.id === activeItemId" class="pi pi-angle-right text-sm" aria-hidden="true" />
      </span>
    </RouterLink>
  </nav>
</template>

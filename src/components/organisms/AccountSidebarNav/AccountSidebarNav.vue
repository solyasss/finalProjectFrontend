<script setup lang="ts">
import type { AccountNavItem } from '@/composables/useAccountNavigation'

interface Props {
  items: AccountNavItem[]
  activeItemId: AccountNavItem['id']
  ariaLabel: string
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', value: AccountNavItem['id']): void
}>()
</script>

<template>
  <nav :aria-label="ariaLabel" class="grid gap-2">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="flex min-h-12 cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors"
      :class="
        item.id === activeItemId
          ? 'border-surface bg-highlight text-color'
          : 'border-surface bg-surface-0 text-muted-color hover:bg-emphasis hover:text-color'
      "
      @click="emit('select', item.id)"
    >
      <span>{{ item.label }}</span>
      <i v-if="item.id === activeItemId" class="pi pi-angle-right text-sm" aria-hidden="true" />
    </button>
  </nav>
</template>

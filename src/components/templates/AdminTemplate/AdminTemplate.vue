<script setup lang="ts">
import DefaultTemplate from '@/components/templates/DefaultTemplate/DefaultTemplate.vue'
import AdminShell from '@/components/organisms/AdminShell/AdminShell.vue'
import type { AdminNavItem } from '@/composables/useAdminNavigation'

interface Props {
  eyebrow: string
  title: string
  description: string
  items: AdminNavItem[]
  activeItemId: AdminNavItem['id']
}

defineProps<Props>()
</script>

<template>
  <DefaultTemplate>
    <AdminShell
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
      :items="items"
      :active-item-id="activeItemId"
    >
      <slot />
    </AdminShell>
  </DefaultTemplate>
</template>

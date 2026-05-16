<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute } from 'vue-router'
import AdminTemplate from '@/components/templates/AdminTemplate/AdminTemplate.vue'
import { useAdminNavigation, type AdminNavItem } from '@/composables/useAdminNavigation'

const route = useRoute()
const { t } = useI18n()
const { items } = useAdminNavigation()

const fallbackNavItem: AdminNavItem = {
  id: 'dashboard',
  label: '',
  description: '',
  routeName: 'admin-dashboard',
  availability: 'available',
}

const activeItem = computed<AdminNavItem>(
  () =>
    items.value.find((item) => item.routeName === route.name) ?? items.value[0] ?? fallbackNavItem,
)
</script>

<template>
  <AdminTemplate
    :eyebrow="t('admin.eyebrow')"
    :title="activeItem.label"
    :description="activeItem.description"
    :items="items"
    :active-item-id="activeItem.id"
  >
    <RouterView />
  </AdminTemplate>
</template>

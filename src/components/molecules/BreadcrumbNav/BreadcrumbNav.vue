<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface BreadcrumbItem {
  label: string
  route?: RouteLocationRaw
}

interface Props {
  items: BreadcrumbItem[]
  currentLabel?: string
}

const props = defineProps<Props>()

const { t } = useI18n()

const homeItem = computed(() => ({
  label: t('pdp.home'),
  route: { name: 'home' },
}))

const breadcrumbItems = computed(() => {
  const trail: BreadcrumbItem[] = props.items.map((item) => ({
    label: item.label,
    route: item.route,
  }))

  if (props.currentLabel) {
    trail.push({ label: props.currentLabel })
  }

  return trail
})
</script>

<template>
  <nav :aria-label="t('pdp.breadcrumbAriaLabel')">
    <Breadcrumb
      :home="homeItem"
      :model="breadcrumbItems"
      :pt="{
        root: {
          style: {
            padding: '0',
            background: 'transparent',
            border: '0',
          },
        },
        separator: {
          style: {
            color: 'var(--p-text-muted-color)',
          },
        },
      }"
    >
      <template #item="{ item }">
        <RouterLink
          v-if="item.route"
          :to="item.route"
          class="text-sm text-muted-color transition-colors hover:text-color"
        >
          {{ item.label }}
        </RouterLink>

        <span v-else class="text-sm font-medium text-color">
          {{ item.label }}
        </span>
      </template>
    </Breadcrumb>
  </nav>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface Props {
  label: string
  to?: RouteLocationRaw
  variant?: 'text' | 'outlined' | 'link'
  severity?: 'secondary' | 'contrast'
  inverted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  variant: 'text',
  severity: 'secondary',
  inverted: false,
})

defineEmits<{
  (event: 'click'): void
}>()

const passThrough = props.inverted
  ? {
      root: { style: { color: 'var(--app-color-text-inverse, #ffffff)' } },
    }
  : undefined
</script>

<template>
  <RouterLink v-if="to" :to="to" class="inline-flex no-underline">
    <Button
      :label="label"
      icon="pi pi-arrow-left"
      :severity="severity"
      :variant="variant"
      type="button"
      :pt="passThrough"
    />
  </RouterLink>

  <Button
    v-else
    :label="label"
    icon="pi pi-arrow-left"
    :severity="severity"
    :variant="variant"
    type="button"
    :pt="passThrough"
    @click="$emit('click')"
  />
</template>

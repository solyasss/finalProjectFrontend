<script setup lang="ts">
interface Props {
  label: string
  variant?: 'id' | 'status' | 'role' | 'default'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span class="rounded-full border border-surface px-2 py-1 text-xs font-medium text-muted-color">
    {{ label }}
  </span>
</template>

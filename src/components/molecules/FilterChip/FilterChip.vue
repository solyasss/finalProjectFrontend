<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  label: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'remove'): void
}>()

const { t } = useI18n()

const removeAriaLabel = computed(() =>
  t('listingControls.removeFilterAriaLabel', { label: props.label }),
)
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-12 items-center gap-2 rounded-full border border-surface bg-surface-0 px-4 py-2 text-sm font-medium text-color transition-colors hover:bg-highlight disabled:cursor-not-allowed disabled:opacity-60"
    :aria-label="removeAriaLabel"
    :disabled="props.disabled"
    @click="emit('remove')"
  >
    <span>{{ props.label }}</span>
    <span class="pi pi-times text-xs" aria-hidden="true" />
  </button>
</template>

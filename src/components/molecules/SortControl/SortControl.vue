<script setup lang="ts">
import { computed } from 'vue'
import Select from 'primevue/select'
import { useI18n } from 'vue-i18n'
import type { SortOption } from '@/api'

interface SortControlOption {
  label: string
  value: SortOption
}

interface Props {
  modelValue: SortOption | ''
  options: SortControlOption[]
  disabled?: boolean
  label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: SortOption | ''): void
}>()

const { t } = useI18n()

const label = computed(() => props.label ?? t('listingControls.sortLabel'))
const selectId = computed(() => `sort-control-${label.value.toLowerCase().replace(/\s+/g, '-')}`)

function handleUpdate(value: SortOption | '' | null | undefined) {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <div class="grid gap-2 md:min-w-64">
    <label :for="selectId" class="text-sm font-semibold text-color">
      {{ label }}
    </label>
    <Select
      :input-id="selectId"
      :model-value="props.modelValue || null"
      :options="props.options"
      option-label="label"
      option-value="value"
      :placeholder="t('listingControls.sortPlaceholder')"
      :disabled="props.disabled"
      fluid
      @update:model-value="handleUpdate"
    />
  </div>
</template>

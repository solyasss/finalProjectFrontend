<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { clampQuantity } from '@/composables/useProductDetailPage'

interface Props {
  modelValue: number
  min?: number
  max?: number
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const { t } = useI18n()

const minValue = computed(() => props.min ?? 1)
const maxValue = computed(() => props.max ?? 99)
const normalizedValue = computed(() =>
  clampQuantity(props.modelValue, minValue.value, maxValue.value),
)
const canDecrement = computed(() => !props.disabled && normalizedValue.value > minValue.value)
const canIncrement = computed(() => !props.disabled && normalizedValue.value < maxValue.value)

function updateValue(next: number) {
  emit('update:modelValue', clampQuantity(next, minValue.value, maxValue.value))
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  updateValue(Number(target.value))
}
</script>

<template>
  <div class="inline-flex items-center rounded border border-surface bg-surface-0">
    <Button
      icon="pi pi-minus"
      severity="secondary"
      text
      rounded
      :disabled="!canDecrement"
      :aria-label="t('pdp.quantityDecrease')"
      data-testid="quantity-decrement"
      @click="updateValue(normalizedValue - 1)"
    />

    <input
      :value="normalizedValue"
      :min="minValue"
      :max="maxValue"
      :disabled="disabled"
      type="number"
      inputmode="numeric"
      class="text-color w-16 border-x border-surface bg-transparent px-2 py-3 text-center text-sm font-semibold outline-none"
      data-testid="quantity-input"
      @input="handleInput"
      @blur="updateValue(normalizedValue)"
    />

    <Button
      icon="pi pi-plus"
      severity="secondary"
      text
      rounded
      :disabled="!canIncrement"
      :aria-label="t('pdp.quantityIncrease')"
      data-testid="quantity-increment"
      @click="updateValue(normalizedValue + 1)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  placeholder?: string
  modelValue?: string
  type?: 'search' | 'number' | 'text'
  inputmode?: 'text' | 'numeric' | 'decimal'
  wideMin?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'search',
  inputmode: 'text',
  wideMin: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()
</script>

<template>
  <label class="grid gap-2 text-sm" :class="wideMin ? 'md:min-w-80' : ''">
    <span class="font-medium text-color">{{ label }}</span>
    <input
      :value="modelValue"
      :type="type"
      :inputmode="inputmode"
      :placeholder="placeholder"
      class="rounded-lg border border-surface px-3 py-2"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @change="emit('change', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

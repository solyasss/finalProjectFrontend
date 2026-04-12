<script setup lang="ts">
import { computed } from 'vue'

interface VariantSelectorOption {
  value: string
  label: string
  hex?: string | null
  image?: string | null
  selected: boolean
  disabled: boolean
}

interface Props {
  label: string
  presentation: 'swatch' | 'text'
  options: VariantSelectorOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', value: string): void
}>()

const selectedLabel = computed(() => props.options.find((option) => option.selected)?.label)

function handleSelect(option: VariantSelectorOption) {
  if (option.disabled || option.selected) {
    return
  }

  emit('select', option.value)
}
</script>

<template>
  <section class="grid gap-3">
    <header class="flex flex-wrap items-baseline justify-between gap-2">
      <h3 class="text-sm font-bold text-color">
        {{ label }}
      </h3>
      <p v-if="selectedLabel" class="text-sm text-muted-color">
        {{ selectedLabel }}
      </p>
    </header>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="transition-colors"
        :class="[
          presentation === 'swatch'
            ? 'flex h-12 w-12 items-center justify-center rounded-full border p-1'
            : 'rounded border',
          option.selected ? 'border-color text-color' : 'border-surface text-color',
          option.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:border-color',
        ]"
        :aria-label="`${label}: ${option.label}`"
        :aria-pressed="option.selected"
        :disabled="option.disabled"
        :data-testid="`variant-option-${option.value}`"
        @click="handleSelect(option)"
      >
        <template v-if="presentation === 'swatch'">
          <span
            v-if="option.hex || option.image"
            class="block h-full w-full rounded-full border border-surface"
            :style="{
              backgroundColor: option.hex ?? undefined,
              backgroundImage: option.image ? `url(${option.image})` : undefined,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }"
          />
          <span v-else class="text-xs font-semibold">{{ option.label.slice(0, 2) }}</span>
        </template>

        <span
          v-else
          class="block min-h-11 rounded px-4 py-3 text-sm font-semibold"
          :class="option.selected ? 'bg-highlight' : 'bg-surface-0'"
        >
          {{ option.label }}
        </span>
      </button>
    </div>
  </section>
</template>

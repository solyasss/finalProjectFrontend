<script setup lang="ts">
import { computed } from 'vue'
import Rating from 'primevue/rating'

interface Props {
  value: number
  size?: 'card' | 'detail'
}

const props = defineProps<Props>()

const displayValue = computed(() => {
  const normalizedValue = Number.isFinite(props.value) ? props.value : 0
  return Math.min(5, Math.max(0, Math.round(normalizedValue)))
})

const iconSize = computed(() => (props.size === 'detail' ? '1rem' : '0.75rem'))
</script>

<template>
  <Rating
    :model-value="displayValue"
    readonly
    :pt="{
      root: { style: { gap: '0.125rem' }, 'aria-hidden': 'true' },
      option: { tabindex: '-1' },
      hiddenOptionInput: { tabindex: '-1' },
    }"
  >
    <template #onicon>
      <i
        class="pi pi-star-fill"
        :style="{ color: 'var(--p-surface-900)', fontSize: iconSize }"
        aria-hidden="true"
      />
    </template>
    <template #officon>
      <i
        class="pi pi-star-fill"
        :style="{ color: 'var(--p-surface-300)', fontSize: iconSize }"
        aria-hidden="true"
      />
    </template>
  </Rating>
</template>

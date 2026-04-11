<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPrice: string
  previousPrice?: string
  size?: 'large' | 'compact'
}

const props = defineProps<Props>()

const showPreviousPrice = computed(() => Boolean(props.previousPrice))
const isCompact = computed(() => props.size === 'compact')
</script>

<template>
  <div class="flex items-end gap-3">
    <span class="text-color font-bold leading-none" :class="isCompact ? 'text-base' : 'text-4xl'">
      {{ currentPrice }}
    </span>

    <span
      v-if="showPreviousPrice"
      class="text-muted-color font-medium leading-none line-through"
      :class="isCompact ? 'pb-0 text-sm' : 'pb-1 text-base'"
    >
      {{ previousPrice }}
    </span>
  </div>
</template>

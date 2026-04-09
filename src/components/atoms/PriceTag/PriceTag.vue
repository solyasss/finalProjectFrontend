<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPrice: string
  previousPrice?: string
}

const props = defineProps<Props>()

const showPreviousPrice = computed(() => Boolean(props.previousPrice))
</script>

<template>
  <div class="flex items-end gap-3">
    <span class="text-color text-4xl font-bold leading-none">
      {{ currentPrice }}
    </span>

    <span
      v-if="showPreviousPrice"
      class="text-muted-color pb-1 text-base font-medium leading-none line-through"
    >
      {{ previousPrice }}
    </span>
  </div>
</template>

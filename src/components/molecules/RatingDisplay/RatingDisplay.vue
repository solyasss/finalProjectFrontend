<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StarRating from '@/components/atoms/StarRating/StarRating.vue'

interface Props {
  average?: number | null
  count?: number | null
  size?: 'card' | 'detail'
}

const props = defineProps<Props>()

const { t } = useI18n()

const hasRating = computed(() => {
  if (props.average == null || props.count == null) {
    return false
  }

  return props.count > 0
})

const formattedAverage = computed(() => {
  if (props.average == null) {
    return null
  }

  return props.average.toFixed(1)
})
</script>

<template>
  <div v-if="hasRating" class="flex items-center gap-2 text-sm text-muted-color">
    <StarRating :value="average ?? 0" :size="size" />
    <span class="text-color font-medium">{{ formattedAverage }}</span>
    <span>{{ t('productCard.reviewCount', { count }) }}</span>
  </div>
</template>

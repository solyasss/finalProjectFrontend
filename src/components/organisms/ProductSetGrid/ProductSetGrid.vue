<script setup lang="ts">
import type { ProductSetSummary } from '@/api'
import ProductSetCard from '@/components/molecules/ProductSetCard/ProductSetCard.vue'

interface Props {
  productSets: ProductSetSummary[]
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-product-set', productSet: ProductSetSummary): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <ProductSetCard
      v-for="productSet in productSets"
      :key="productSet.id"
      :product-set="productSet"
      @select="emit('select-product-set', $event)"
      clickable
    />
  </div>
</template>

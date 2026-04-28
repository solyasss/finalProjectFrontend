<script setup lang="ts">
import type { ProductSetVariant } from '@/api'
import ProductSetVariantCard from '@/components/molecules/ProductSetVariantCard/ProductSetVariantCard.vue'

interface Props {
  variants: ProductSetVariant[]
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <ProductSetVariantCard v-for="variant in variants" :key="variant.id" :variant="variant" />
  </div>
</template>

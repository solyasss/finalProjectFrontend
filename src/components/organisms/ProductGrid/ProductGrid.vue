<script setup lang="ts">
import ProductCard from '@/components/molecules/ProductCard/ProductCard.vue'
import type { ProductCard as ApiProductCard } from '@/api'

interface Props {
  products: ApiProductCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-product', product: ApiProductCard): void
}>()

function handleSelect(product: ApiProductCard) {
  emit('select-product', product)
}

function getProductKey(product: ApiProductCard) {
  return product.variantId ? `${product.id}-${product.variantId}` : String(product.id)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <ProductCard
      v-for="product in props.products"
      :key="getProductKey(product)"
      :product="product"
      :clickable="true"
      @select="handleSelect"
    />
  </div>
</template>

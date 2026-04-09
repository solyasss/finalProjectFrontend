<script setup lang="ts">
import type { Component } from 'vue'
import MoleculeCarousel from '@/components/molecules/MoleculeCarousel/MoleculeCarousel.vue'

type CarouselItem = Record<string, unknown>

interface ResponsiveOption {
  breakpoint: string
  numVisible: number
  numScroll: number
}

interface Props {
  title: string
  items: CarouselItem[]
  itemComponent: Component
  itemProps?: Record<string, unknown>
  itemKey?: string
  numVisible?: number
  numScroll?: number
  circular?: boolean
  showIndicators?: boolean
  showNavigators?: boolean
  responsiveOptions?: ResponsiveOption[]
  contentClass?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-item', payload: { index: number; item: CarouselItem }): void
}>()
</script>

<template>
  <section class="grid gap-6" :aria-label="title">
    <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
      {{ title }}
    </h2>

    <MoleculeCarousel
      :items="items"
      :item-component="itemComponent"
      :item-props="itemProps"
      :item-key="itemKey"
      :num-visible="numVisible"
      :num-scroll="numScroll"
      :circular="circular"
      :show-indicators="showIndicators"
      :show-navigators="showNavigators"
      :responsive-options="responsiveOptions"
      :content-class="contentClass"
      @select-item="emit('select-item', $event)"
    />
  </section>
</template>

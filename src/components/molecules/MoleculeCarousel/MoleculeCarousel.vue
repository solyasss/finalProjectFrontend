<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import Carousel from 'primevue/carousel'

type CarouselItem = Record<string, unknown>

interface ResponsiveOption {
  breakpoint: string
  numVisible: number
  numScroll: number
}

interface Props {
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

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-item', payload: { index: number; item: CarouselItem }): void
}>()

const items = computed(() => props.items ?? [])
const itemProps = computed(() => props.itemProps ?? {})
const itemKey = computed(() => props.itemKey ?? 'id')
const numVisible = computed(() => props.numVisible ?? 1)
const numScroll = computed(() => props.numScroll ?? 1)
const circular = computed(() => props.circular ?? false)
const showIndicators = computed(() => props.showIndicators ?? false)
const showNavigators = computed(() => props.showNavigators ?? true)
const responsiveOptions = computed(() => props.responsiveOptions ?? [])

function resolveItemKey(item: CarouselItem, index: number) {
  const key = item[itemKey.value]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

function resolveItemProps(item: CarouselItem) {
  return {
    ...itemProps.value,
    ...item,
  }
}

function handleSelect(index: number, item: CarouselItem) {
  emit('select-item', { index, item })
}
</script>

<template>
  <Carousel
    :value="items"
    :num-visible="numVisible"
    :num-scroll="numScroll"
    :circular="circular"
    :show-indicators="showIndicators"
    :show-navigators="showNavigators"
    :responsive-options="responsiveOptions"
  >
    <template #item="{ data, index }">
      <div :key="resolveItemKey(data, index)" :class="contentClass">
        <component
          :is="itemComponent"
          :key="resolveItemKey(data, index)"
          v-bind="resolveItemProps(data)"
          @select="handleSelect(index, data)"
        />
      </div>
    </template>
  </Carousel>
</template>

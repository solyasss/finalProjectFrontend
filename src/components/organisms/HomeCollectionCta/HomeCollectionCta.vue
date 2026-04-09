<script setup lang="ts">
import { computed } from 'vue'
import ProductCutoutCard from '@/components/molecules/ProductCutoutCard/ProductCutoutCard.vue'

interface CollectionItem {
  imageSrc: string
  imageAlt: string
  title: string
  actionIcon?: string
  actionAriaLabel?: string
  actionPlacement?: 'bottom' | 'right' | 'none'
}

interface Props {
  title: string
  items: CollectionItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-item', index: number): void
}>()

const normalizedItems = computed<CollectionItem[]>(() =>
  props.items.slice(0, 3).map((item, index) => ({
    ...item,
    actionPlacement: item.actionPlacement ?? (index < 2 ? 'bottom' : 'right'),
  })),
)

const topItems = computed(() => normalizedItems.value.slice(0, 2))
const bottomItem = computed(() => normalizedItems.value[2])

function handleSelectItem(index: number) {
  emit('select-item', index)
}
</script>

<template>
  <section class="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6" :aria-label="title">
    <h2 class="text-color m-0 text-3xl font-bold uppercase leading-tight md:text-4xl">
      {{ title }}
    </h2>

    <div class="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-6">
      <div class="grid min-h-0 grid-cols-2 gap-4 md:gap-6">
        <ProductCutoutCard
          v-for="(item, index) in topItems"
          :key="`${item.title}-${index}`"
          :image-src="item.imageSrc"
          :image-alt="item.imageAlt"
          :title="item.title"
          :action-icon="item.actionIcon"
          :action-aria-label="item.actionAriaLabel"
          :action-placement="item.actionPlacement"
          image-fit="cover"
          clickable
          fill-height
          @select="handleSelectItem(index)"
        />
      </div>

      <ProductCutoutCard
        v-if="bottomItem"
        :image-src="bottomItem.imageSrc"
        :image-alt="bottomItem.imageAlt"
        :title="bottomItem.title"
        :action-icon="bottomItem.actionIcon"
        :action-aria-label="bottomItem.actionAriaLabel"
        :action-placement="bottomItem.actionPlacement"
        image-fit="cover"
        clickable
        fill-height
        @select="handleSelectItem(2)"
      />
    </div>
  </section>
</template>

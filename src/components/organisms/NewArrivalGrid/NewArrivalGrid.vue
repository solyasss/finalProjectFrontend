<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductCutoutCard from '@/components/molecules/ProductCutoutCard/ProductCutoutCard.vue'

interface NewArrivalItem {
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  clickable?: boolean
}

interface Props {
  title: string
  items: NewArrivalItem[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (event: 'select-item', index: number): void
}>()

const visibleItems = computed(() => props.items.slice(0, 4))

function handleSelectItem(index: number) {
  emit('select-item', index)
}
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col" :aria-label="title">
    <h2 class="text-color mb-6 flex-none text-3xl font-bold uppercase leading-tight md:text-4xl">
      {{ title }}
    </h2>
    <section
      class="grid min-h-0 flex-1 grid-rows-[1fr_1fr] gap-4 overflow-hidden sm:grid-rows-[1fr_2fr]"
      :aria-label="t('newArrivalGrid.sectionAriaLabel')"
    >
      <div class="grid min-h-0 grid-cols-2 gap-4 sm:grid-cols-[1fr_2fr]">
        <div
          v-for="(item, index) in visibleItems.slice(0, 2)"
          :key="`${item.image.alt}-${index}`"
          class="h-full min-h-0 min-w-0"
        >
          <ProductCutoutCard
            :image="item.image"
            image-fit="cover"
            action-placement="none"
            fill-height
            :clickable="item.clickable ?? true"
            @select="handleSelectItem(index)"
          />
        </div>
      </div>

      <div class="grid min-h-0 grid-cols-2 gap-4 sm:grid-cols-[2fr_1fr]">
        <div
          v-for="(item, index) in visibleItems.slice(2, 4)"
          :key="`${item.image.alt}-${index + 2}`"
          class="h-full min-h-0 min-w-0"
        >
          <ProductCutoutCard
            :image="item.image"
            image-fit="cover"
            action-placement="none"
            fill-height
            :clickable="item.clickable ?? true"
            @select="handleSelectItem(index + 2)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

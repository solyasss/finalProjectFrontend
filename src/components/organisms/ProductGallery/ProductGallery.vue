<script setup lang="ts">
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import { computed, ref, watch } from 'vue'

interface Props {
  images: string[]
  name: string
}

const props = defineProps<Props>()

const activeIndex = ref(0)

const galleryImages = computed(() => props.images ?? [])
const hasImages = computed(() => galleryImages.value.length > 0)
const showThumbnails = computed(() => galleryImages.value.length > 1)
const numVisible = computed(() => Math.min(galleryImages.value.length, 10))

watch(
  galleryImages,
  (images) => {
    if (!images.length) {
      activeIndex.value = 0
      return
    }

    if (activeIndex.value > images.length - 1) {
      activeIndex.value = 0
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="grid h-full gap-4">
    <p class="sr-only" aria-live="polite" data-testid="gallery-active-alt">
      {{ galleryImages[activeIndex] || name }}
    </p>

    <div
      v-if="!hasImages"
      class="flex aspect-square items-center justify-center rounded-2xl bg-surface-100 p-6 text-center text-sm text-muted-color"
    >
      {{ name }}
    </div>

    <Galleria
      v-else
      v-model:activeIndex="activeIndex"
      :value="galleryImages"
      :num-visible="numVisible"
      :show-item-navigators="showThumbnails"
      :show-thumbnail-navigators="false"
      :showItemNavigatorsOnHover="showThumbnails"
      :show-thumbnails="showThumbnails"
      circular
      :pt="{
        root: { style: { height: '100%', display: 'flex', flexDirection: 'column' } },
        content: { style: { flex: '1', minHeight: '0', display: 'flex', flexDirection: 'column' } },
        itemsContainer: { style: { flex: '1', minHeight: '0' } },
        items: { style: { height: '100%' } },
        item: { style: { height: '100%' } },
        prevButton: { style: { zIndex: '1' } },
        nextButton: { style: { zIndex: '1' } },
        thumbnailItems: { style: { justifyContent: 'center', gap: '0.5rem' } },
        thumbnailItem: { style: { flex: '0 0 auto' } },
      }"
    >
      <template #item="slotProps">
        <div class="h-full w-full overflow-hidden bg-surface-100">
          <Image
            preview
            :src="slotProps.item"
            :alt="name"
            :pt="{
              root: {
                style: {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                },
              },
              image: {
                style: {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                },
              },
            }"
          />
        </div>
      </template>

      <template #thumbnail="slotProps">
        <div class="flex overflow-hidden rounded-lg border border-surface bg-surface-0">
          <img
            :src="slotProps.item"
            :alt="name"
            class="aspect-square h-20 w-20 object-cover"
            :data-testid="`gallery-thumbnail-${name}`"
          />
        </div>
      </template>
    </Galleria>
  </section>
</template>

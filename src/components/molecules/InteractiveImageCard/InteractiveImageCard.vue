<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Image from 'primevue/image'

interface Props {
  imageSrc?: string | null
  imageAlt: string
  noImageLabel: string
  clickable?: boolean
  imageAspectClass?: string
  contentClass?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const isClickable = computed(() => props.clickable ?? true)
const imageAspectClass = computed(() => props.imageAspectClass ?? 'aspect-[4/3]')
const contentClass = computed(() => props.contentClass ?? 'grid content-start gap-3 p-4')

function handleSelect() {
  if (!isClickable.value) {
    return
  }

  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: {
        style: {
          height: '100%',
          overflow: 'hidden',
          textAlign: 'left',
          borderRadius: '0.5rem',
        },
      },
      body: { style: { padding: '0', height: '100%' } },
      content: { style: { padding: '0', height: '100%' } },
    }"
  >
    <template #content>
      <article
        class="grid h-full grid-rows-[auto_1fr] border border-surface bg-surface-0 transition-shadow hover:shadow-md"
        :class="{ 'cursor-pointer': isClickable }"
        :role="isClickable ? 'button' : undefined"
        :tabindex="isClickable ? 0 : undefined"
        @click="handleSelect"
        @keydown.enter.prevent="handleSelect"
        @keydown.space.prevent="handleSelect"
      >
        <div class="relative w-full overflow-hidden bg-surface-100" :class="imageAspectClass">
          <Image
            v-if="imageSrc"
            :src="imageSrc"
            :alt="imageAlt"
            :pt="{
              root: {
                style: {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  background: 'var(--p-surface-100)',
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
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-xs text-muted-color"
          >
            {{ noImageLabel }}
          </div>

          <slot name="image-overlay" />
        </div>

        <div :class="contentClass">
          <slot />
        </div>
      </article>
    </template>
  </Card>
</template>

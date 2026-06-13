<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Image from 'primevue/image'

interface Props {
  imageSrc: string
  imageAlt: string
  title: string
  clickable?: boolean
  smallerText?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const isClickable = computed(() => props.clickable ?? false)

function handleClick() {
  if (!isClickable.value) return
  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: {
        style: {
          position: 'relative',
          display: 'block',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          cursor: isClickable ? 'pointer' : 'default',
        },
      },
      body: { style: { padding: '0' } },
      content: { style: { padding: '0' } },
    }"
    @click="handleClick"
  >
    <template #content>
      <Image
        :src="imageSrc"
        :alt="imageAlt"
        :pt="{
          root: { style: { display: 'block' } },
          image: {
            style: { display: 'block', width: '100%', aspectRatio: '3/4', objectFit: 'cover' },
          },
        }"
      />

      <!-- font-size and padding are in scoped CSS to allow responsive overrides via media query -->
      <Button
        type="button"
        rounded
        :label="title"
        :disabled="!isClickable"
        :class="[
          'collection-overlay-card__pill',
          { 'collection-overlay-card__pill--smaller-text': smallerText },
        ]"
        :pt="{
          root: {
            style: {
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 'calc(100% - 2rem)',
              border: 'none',
              background: 'var(--color-brand-white)',
              color: 'var(--color-gray-900)',
              fontWeight: '700',
              lineHeight: '1.2',
            },
          },
        }"
        @click.stop="handleClick"
      />
    </template>
  </Card>
</template>

<style scoped>
/* font-size and padding kept in scoped CSS - inline style cannot be targeted by @media queries */
.collection-overlay-card__pill {
  font-size: var(--collection-overlay-card-pill-font-size, 1.125rem);
  padding: 0.75rem 1.5rem;
}

.collection-overlay-card__pill :deep(.p-button-label) {
  display: -webkit-box;
  overflow: hidden;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.collection-overlay-card__pill--smaller-text {
  --collection-overlay-card-pill-font-size: 0.75rem;
}

@media (max-width: 639px) {
  .collection-overlay-card__pill {
    --collection-overlay-card-pill-font-size: 0.875rem;
    padding: 0.625rem 1rem;
  }

  .collection-overlay-card__pill--smaller-text {
    --collection-overlay-card-pill-font-size: 0.5833rem;
  }
}
</style>

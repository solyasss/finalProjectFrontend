<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Image from 'primevue/image'

interface Props {
  imageSrc: string
  imageAlt: string
  actionIcon?: string
  actionAriaLabel?: string
  showAction?: boolean
  clickable?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const actionIcon = computed(() => props.actionIcon ?? 'pi pi-arrow-up-right')
const actionAriaLabel = computed(() => props.actionAriaLabel ?? 'Open card')
const showAction = computed(() => props.showAction ?? true)
const clickable = computed(() => props.clickable ?? true)

function handleSelect() {
  if (!clickable.value) return
  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: {
        style: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          cursor: clickable ? 'pointer' : 'default',
        },
      },
      body: { style: { padding: '0' } },
      content: { style: { padding: '0' } },
    }"
  >
    <template #content>
      <Image
        :src="imageSrc"
        :alt="imageAlt"
        :pt="{
          root: { style: { display: 'block' } },
          image: {
            style: { display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover' },
          },
        }"
      />

      <Button
        v-if="showAction"
        type="button"
        rounded
        text
        :icon="actionIcon"
        :aria-label="actionAriaLabel"
        :pt="{
          root: {
            style: {
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              height: '2.75rem',
              width: '2.75rem',
              background: 'var(--color-brand-white)',
              color: 'var(--color-gray-900)',
              border: 'none',
            },
          },
        }"
        @click="handleSelect"
      />
    </template>
  </Card>
</template>

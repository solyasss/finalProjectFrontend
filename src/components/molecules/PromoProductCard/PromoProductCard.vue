<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Image from 'primevue/image'
import Tag from 'primevue/tag'

interface Props {
  imageSrc: string
  imageAlt: string
  title: string
  subtitle?: string
  price: string
  badgeText?: string
  clickable?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const isClickable = computed(() => props.clickable ?? false)
const showSubtitle = computed(() => Boolean(props.subtitle))
const showBadge = computed(() => Boolean(props.badgeText))

function handleSelect() {
  if (!isClickable.value) return
  emit('select')
}
</script>

<template>
  <Card
    :pt="{
      root: {
        style: {
          display: 'grid',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          background: 'var(--p-surface-100)',
          textAlign: 'left',
          cursor: isClickable ? 'pointer' : 'default',
        },
      },
      body: { style: { padding: '0' } },
      content: { style: { padding: '0' } },
    }"
    @click="handleSelect"
  >
    <template #content>
      <!-- custom div: Tailwind fine for layout -->
      <div class="relative">
        <Image
          :src="imageSrc"
          :alt="imageAlt"
          :pt="{
            root: { style: { display: 'block' } },
            image: {
              style: { display: 'block', width: '100%', aspectRatio: '5/4', objectFit: 'cover' },
            },
          }"
        />

        <Tag
          v-if="showBadge"
          rounded
          :value="badgeText"
          :pt="{
            root: {
              style: {
                position: 'absolute',
                top: '0.875rem',
                right: '0.875rem',
                minHeight: '3.5rem',
                minWidth: '3.5rem',
                border: 'none',
                background: '#8ea9a8',
                padding: '0.25rem 0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                lineHeight: '1',
                textTransform: 'uppercase',
                color: 'var(--p-primary-contrast-color)',
              },
            },
          }"
        />
      </div>

      <!-- custom div + typography: Tailwind fine on plain HTML, responsive prefixes work -->
      <div class="grid gap-[0.375rem] pt-4 px-5 pb-5">
        <h3 class="text-color m-0 text-[2.25rem] font-bold leading-[1.05] max-sm:text-[1.75rem]">
          {{ title }}
        </h3>
        <p
          v-if="showSubtitle"
          class="text-muted-color m-0 text-sm font-normal leading-[1.35] line-clamp-1"
        >
          {{ subtitle }}
        </p>
        <p class="text-color m-0 mt-2 text-[3rem] font-bold leading-none max-sm:text-[2.25rem]">
          {{ price }}
        </p>
      </div>
    </template>
  </Card>
</template>

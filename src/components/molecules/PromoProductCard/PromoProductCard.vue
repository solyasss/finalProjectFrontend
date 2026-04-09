<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'

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
          height: '100%',
          minHeight: '0',
          overflow: 'hidden',
          borderRadius: '1.5rem',
          background: 'var(--p-surface-100)',
          textAlign: 'left',
          cursor: isClickable ? 'pointer' : 'default',
        },
      },
      body: { style: { padding: '0', height: '100%', minHeight: '0' } },
      content: { style: { padding: '0', height: '100%', minHeight: '0' } },
    }"
    @click="handleSelect"
  >
    <template #content>
      <div class="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]">
        <div class="relative min-h-0 overflow-hidden">
          <Image
            :src="imageSrc"
            :alt="imageAlt"
            :pt="{
              root: {
                style: {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  minHeight: '0',
                  background: 'var(--p-surface-50)',
                },
              },
              image: {
                style: {
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  objectPosition: 'center',
                },
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
                  background: '#8ea9a8', // TODO: use theme variable
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

        <div class="grid gap-1.5 px-5 pb-5 pt-4">
          <h3 class="text-color m-0 text-xl font-bold">
            {{ title }}
          </h3>
          <p
            v-if="showSubtitle"
            class="text-muted-color m-0 text-sm font-normal leading-[1.35] line-clamp-1"
          >
            {{ subtitle }}
          </p>
          <PriceTag :current-price="price" />
        </div>
      </div>
    </template>
  </Card>
</template>

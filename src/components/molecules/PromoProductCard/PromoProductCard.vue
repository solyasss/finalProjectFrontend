<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import InteractiveImageCard from '@/components/molecules/InteractiveImageCard/InteractiveImageCard.vue'

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
  <InteractiveImageCard
    :image-src="imageSrc"
    :image-alt="imageAlt"
    no-image-label=""
    :clickable="isClickable"
    image-aspect-class="h-32"
    content-class="grid gap-1.5 px-5 pb-5 pt-4"
    class="overflow-hidden rounded-[1.5rem] bg-surface-100"
    @select="handleSelect"
  >
    <template #image-overlay>
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
              background: 'var(--app-color-accent-promo-badge, #8ea9a8)',
              padding: '0.25rem 0.75rem',
              fontSize: '1rem',
              fontWeight: '500',
              lineHeight: '1',
              textTransform: 'uppercase',
              color: 'var(--app-color-text-inverse, #ffffff)',
            },
          },
        }"
      />
    </template>

    <template #default>
      <h3 class="text-color m-0 text-base font-bold leading-tight">
        {{ title }}
      </h3>
      <p
        v-if="showSubtitle"
        class="text-muted-color m-0 line-clamp-1 text-xs font-normal leading-[1.35]"
      >
        {{ subtitle }}
      </p>
      <PriceTag :current-price="price" size="compact" />
    </template>
  </InteractiveImageCard>
</template>

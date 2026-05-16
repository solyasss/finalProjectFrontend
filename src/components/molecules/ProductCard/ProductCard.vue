<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Image from 'primevue/image'
import { useI18n } from 'vue-i18n'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import RatingDisplay from '@/components/molecules/RatingDisplay/RatingDisplay.vue'
import type { ProductCard } from '@/api'

interface Props {
  product: ProductCard
  clickable?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select', product: ProductCard): void
}>()

const { t } = useI18n()

const isClickable = computed(() => props.clickable ?? true)
const hasDescription = computed(() => Boolean(props.product.description))
const hasRating = computed(() => Boolean(props.product.ratingCount))
const formattedPrice = computed(() => {
  const price = props.product.price?.trim()

  if (!price) {
    return null
  }

  return `${price} ₴`
})

function handleSelect() {
  if (!isClickable.value) {
    return
  }

  emit('select', props.product)
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
          cursor: isClickable ? 'pointer' : 'default',
          borderRadius: '0.5rem',
        },
      },
      body: { style: { padding: '0', height: '100%' } },
      content: { style: { padding: '0', height: '100%' } },
    }"
    @click="handleSelect"
  >
    <template #content>
      <article
        class="group grid h-full grid-rows-[auto_1fr] border border-surface bg-surface-0 transition-shadow hover:shadow-md"
      >
        <div class="relative aspect-square w-full overflow-hidden bg-surface-100">
          <Image
            v-if="product.baseImageUrl"
            :src="product.baseImageUrl"
            :alt="product.name"
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
            class="flex h-full w-full items-center justify-center text-muted-color text-xs"
          >
            {{ t('productCard.noImage') }}
          </div>
        </div>

        <div class="grid content-start gap-3 p-4">
          <div class="space-y-2">
            <h3 class="text-color line-clamp-2 text-sm font-bold leading-5">
              {{ product.name }}
            </h3>
            <p v-if="hasDescription" class="text-muted-color line-clamp-2 text-xs leading-5">
              {{ product.description }}
            </p>
          </div>

          <PriceTag v-if="formattedPrice" :current-price="formattedPrice" size="compact" />
          <p v-else class="text-surface-500 text-xs italic">
            <em>{{ t('productCard.priceAvailableInFutureRelease') }}</em>
          </p>

          <RatingDisplay
            v-if="hasRating"
            :average="product.ratingAverage ?? undefined"
            :count="product.ratingCount ?? undefined"
            size="card"
          />
        </div>
      </article>
    </template>
  </Card>
</template>

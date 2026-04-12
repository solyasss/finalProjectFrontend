<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Image from 'primevue/image'
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import RatingDisplay from '@/components/molecules/RatingDisplay/RatingDisplay.vue'
import type { Badge, ProductCard } from '@/api'

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
const hasDescription = computed(() => Boolean(props.product.shortDescription))
const hasRating = computed(() => Boolean(props.product.rating?.count))
const hasVariants = computed(() => Boolean(props.product.variantPreview?.totalVariants))

const badgeItems = computed(() => props.product.badges.slice(0, 2))

const badgeSeverityMap: Record<Badge, 'contrast' | 'danger' | 'warn' | 'info'> = {
  NEW: 'info',
  BEST_SELLER: 'contrast',
  LAST_CHANCE: 'danger',
  MEMBER_PRICE: 'warn',
}

function formatBadgeLabel(badge: Badge) {
  return badge.replaceAll('_', ' ')
}

function handleSelect() {
  if (!isClickable.value) {
    return
  }

  emit('select', props.product)
}

// TODO: confirm PLP/Search availability data contract with backend
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
      body: { style: { padding: '0', height: '100%'  } },
      content: { style: { padding: '0', height: '100%'   } },
    }"
    @click="handleSelect"
  >
    <template #content>
      <article
        class="group grid h-full grid-rows-[auto_1fr] border border-surface bg-surface-0 transition-shadow hover:shadow-md"
      >
        <div class="relative aspect-square overflow-hidden bg-surface-100">
          <Image
            :src="product.heroImage.url"
            :alt="product.heroImage.alt"
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

          <div v-if="badgeItems.length" class="absolute left-3 top-3 flex flex-wrap gap-2">
            <Tag
              v-for="badge in badgeItems"
              :key="badge"
              :value="formatBadgeLabel(badge)"
              :severity="badgeSeverityMap[badge]"
            />
          </div>
        </div>

        <div class="grid content-start gap-3 p-4">
          <div class="space-y-2">
            <h3 class="text-color line-clamp-2 text-sm font-bold leading-5">
              {{ product.name }}
            </h3>
            <p v-if="hasDescription" class="text-muted-color line-clamp-2 text-xs leading-5">
              {{ product.shortDescription }}
            </p>
          </div>

          <PriceTag
            :current-price="product.price.formatted"
            :previous-price="product.previousPrice?.formatted ?? undefined"
            size="compact"
          />

          <RatingDisplay
            v-if="hasRating"
            :average="product.rating?.average"
            :count="product.rating?.count"
            size="card"
          />

          <p v-if="hasVariants" class="text-muted-color text-xs leading-5">
            {{
              t('productCard.variantCount', { count: product.variantPreview?.totalVariants ?? 0 })
            }}
          </p>
        </div>
      </article>
    </template>
  </Card>
</template>

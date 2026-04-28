<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'
import type { ProductSetVariant } from '@/api'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import InteractiveImageCard from '@/components/molecules/InteractiveImageCard/InteractiveImageCard.vue'

interface Props {
  variant: ProductSetVariant
}

const props = defineProps<Props>()
const { t } = useI18n()

const primaryImage = computed(() => props.variant.images[0] ?? null)
const formattedPrice = computed(() => `${props.variant.price} ₴`)
const stockMeta = computed(() => {
  if (props.variant.stock <= 0) {
    return {
      label: t('productSetVariantCard.stockOut'),
      severity: 'danger' as const,
    }
  }

  if (props.variant.stock <= 5) {
    return {
      label: t('productSetVariantCard.stockLow', { count: props.variant.stock }),
      severity: 'warn' as const,
    }
  }

  return {
    label: t('productSetVariantCard.stockIn', { count: props.variant.stock }),
    severity: 'success' as const,
  }
})
</script>

<template>
  <InteractiveImageCard
    :image-src="primaryImage"
    :image-alt="variant.sku"
    :no-image-label="t('productSetVariantCard.noImage')"
    :clickable="false"
    image-aspect-class="aspect-square"
    content-class="grid content-start gap-4 p-4"
  >
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="grid gap-2">
        <h3 class="text-base font-bold text-color">
          {{ variant.sku }}
        </h3>
        <PriceTag :current-price="formattedPrice" size="compact" />
      </div>

      <Tag :value="stockMeta.label" :severity="stockMeta.severity" />
    </div>

    <dl class="grid gap-3 text-sm">
      <div class="grid gap-1">
        <dt class="text-muted-color">{{ t('productSetVariantCard.skuLabel') }}</dt>
        <dd class="font-medium text-color">{{ variant.sku }}</dd>
      </div>

      <div class="grid gap-1">
        <dt class="text-muted-color">{{ t('productSetVariantCard.colorLabel') }}</dt>
        <dd class="font-medium text-color">
          {{ variant.color || t('productSetVariantCard.colorUnavailable') }}
        </dd>
      </div>
    </dl>

    <p class="text-xs font-medium uppercase tracking-[0.16em] text-muted-color">
      {{ t('productSetVariantCard.phoneOrderNote') }}
    </p>
  </InteractiveImageCard>
</template>

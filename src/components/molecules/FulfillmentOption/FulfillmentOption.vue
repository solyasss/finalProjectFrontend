<script setup lang="ts">
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'
import type { FulfillmentOption as ProductFulfillmentOption } from '@/api'

interface Props {
  option: ProductFulfillmentOption
}

defineProps<Props>()

const { t } = useI18n()

function resolveIcon(type: ProductFulfillmentOption['type']) {
  if (type === 'DELIVERY') {
    return 'pi pi-truck'
  }

  if (type === 'CLICK_AND_COLLECT') {
    return 'pi pi-box'
  }

  return 'pi pi-shop'
}

function formatTypeLabel(type: ProductFulfillmentOption['type']) {
  return t(`pdp.fulfillmentTypes.${type}`)
}
</script>

<template>
  <article class="grid gap-2 rounded border border-surface bg-surface-0 p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <span :class="[resolveIcon(option.type), 'pt-1 text-color']" aria-hidden="true" />
        <div class="space-y-1">
          <h4 class="text-sm font-bold text-color">
            {{ formatTypeLabel(option.type) }}
          </h4>
          <p v-if="option.etaText" class="text-sm text-color">
            {{ option.etaText }}
          </p>
          <p v-if="option.message" class="text-sm text-muted-color">
            {{ option.message }}
          </p>
        </div>
      </div>

      <Tag
        :severity="option.available ? 'success' : 'secondary'"
        :value="
          option.available ? t('pdp.availabilityAvailable') : t('pdp.availabilityUnavailable')
        "
      />
    </div>

    <p v-if="option.cost" class="text-sm font-medium text-color">
      {{ option.cost.formatted }}
    </p>
  </article>
</template>

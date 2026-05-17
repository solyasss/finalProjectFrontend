<script setup lang="ts">
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import QuantitySelector from '@/components/atoms/QuantitySelector/QuantitySelector.vue'
import FulfillmentOption from '@/components/molecules/FulfillmentOption/FulfillmentOption.vue'
import RatingDisplay from '@/components/molecules/RatingDisplay/RatingDisplay.vue'
import VariantSelector from '@/components/molecules/VariantSelector/VariantSelector.vue'
import type { CtaMessage, SelectorGroup } from '@/composables/useProductDetailPage'
import type {
  FulfillmentOption as ProductFulfillmentOption,
  ProductDetails,
  ProductVariant,
  FulfillmentType,
  Money
} from '@/api'

interface Props {
  product: ProductDetails
  selectedVariant: ProductVariant | null
  selectorGroups: SelectorGroup[]
  availability: ProductFulfillmentOption[]
  quantity: number
  loadingAvailability: boolean
  addingToCart: boolean
  canAddToCart: boolean
  availabilityError?: string | null
  ctaMessage?: CtaMessage | null
}

const availability = computed(() => props.availability || 
[
  {
    type: 'shipping',
    available: true,
    etaText: '3-5 business days',
    cost: 50,
    message: 'Delivery Options Will Be Available Soon',
  },
])

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select-option', payload: { groupKey: string; value: string }): void
  (event: 'update:quantity', value: number): void
  (event: 'add-to-cart'): void
}>()

const { t } = useI18n()

const formattedPrice = computed(() => `${props.selectedVariant!.price} ₴`)
</script>

<template>
  <aside
    class="grid gap-6 rounded-3xl border border-surface bg-surface-0 p-5 md:p-6 lg:sticky lg:top-6"
  >
    <header class="grid gap-4">
      <!-- TODO: badges not returned by backend API yet.
           To enable once backend supports it.
      <div class="flex flex-wrap gap-2">
        <Tag v-for="badge in product.badges" :key="badge" ... />
      </div>
      <p>Available in future release</p>
      -->

      <div class="space-y-3">
        <!-- TODO: series not returned by backend API yet.
            To enable once backend supports it.
          <p v-if="product.series" ...>{{ product.series }}</p>
          <p>Available in future release</p>
        -->
        <h1 class="text-3xl font-bold text-color md:text-4xl">
          {{ product.name }}
        </h1>
        <p class="text-base leading-7 text-muted-color">
          {{ product.description }}
        </p>
      </div>

      <RatingDisplay
        v-if="product.ratingCount"
        :average="product.ratingAverage ?? undefined"
        :count="product.ratingCount"
        size="detail"
      />

      <PriceTag v-if="selectedVariant && formattedPrice" :current-price="formattedPrice" />
    </header>

    <section v-if="selectorGroups.length" class="grid gap-5">
      <VariantSelector
        v-for="group in selectorGroups"
        :key="group.key"
        :label="group.label"
        :presentation="group.presentation"
        :options="group.options"
        @select="emit('select-option', { groupKey: group.key, value: $event })"
      />
    </section>

    <section class="grid gap-3">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-base font-bold text-color">
          {{ t('pdp.fulfillmentTitle') }}
        </h2>
        <span v-if="loadingAvailability" class="text-sm text-muted-color">
          {{ t('pdp.availabilityLoading') }}
        </span>
      </div>

      <Message v-if="availabilityError" severity="secondary" variant="simple">
        {{ availabilityError }}
      </Message>
      
      <FulfillmentOption
        v-if="!availability.length"
        :option="{
          type: 'DELIVERY' as FulfillmentType,
          available: false,
          etaText: '',
          cost: { amountMinor: 0, currency: 'UAH', formatted: '0 ₴' } as Money,
          message: t('pdp.availabilityError'),
        }"
      />
      <FulfillmentOption v-for="option in availability" :key="option.type" :option="option" />
    </section>

    <section class="grid gap-3">
      <h2 class="text-base font-bold text-color">
        {{ t('pdp.quantity') }}
      </h2>
      <div class="flex gap-6">
        <QuantitySelector
          :model-value="quantity"
          :disabled="addingToCart"
          @update:model-value="emit('update:quantity', $event)"
        />
        <Button
          :label="addingToCart ? t('pdp.addingToCart') : t('pdp.addToCart')"
          icon="pi pi-shopping-cart"
          icon-pos="right"
          fluid
          :loading="addingToCart"
          :disabled="!canAddToCart"
          @click="emit('add-to-cart')"
        />
      </div>
    </section>
    <Message v-if="ctaMessage" :severity="ctaMessage.severity">
      {{ ctaMessage.text }}
    </Message>
  </aside>
</template>

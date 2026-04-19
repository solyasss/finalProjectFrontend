<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import type { CartLine, OrderSummary, OrderTrackingStep } from '@/api'
import OrderLineItemRow from '@/components/molecules/OrderLineItemRow/OrderLineItemRow.vue'
import OrderSummaryCard from '@/components/molecules/OrderSummaryCard/OrderSummaryCard.vue'
import OrderTrackingTimeline from '@/components/organisms/OrderTrackingTimeline/OrderTrackingTimeline.vue'

interface Props {
  order: OrderSummary
  lines: CartLine[]
  shippingAddress: Record<string, string> | null
  trackingSteps: OrderTrackingStep[]
  trackingStatus?: string | null
  trackingError?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  trackingStatus: null,
  trackingError: null,
})

const emit = defineEmits<{
  (event: 'back'): void
}>()

const { t } = useI18n()

const shippingAddressEntries = computed(() => {
  if (!props.shippingAddress) {
    return []
  }

  return Object.entries(props.shippingAddress).filter(([, value]) => Boolean(value))
})

function formatAddressKey(key: string) {
  const knownLabels: Record<string, string> = {
    street: t('orderDetailPage.shippingFields.street'),
    city: t('orderDetailPage.shippingFields.city'),
    postalCode: t('orderDetailPage.shippingFields.postalCode'),
    region: t('orderDetailPage.shippingFields.region'),
  }

  if (knownLabels[key]) {
    return knownLabels[key]
  }

  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .replace(/^./, (value) => value.toUpperCase())
}
</script>

<template>
  <div class="grid gap-5">
    <div class="flex justify-start">
      <Button
        :label="t('orderDetailPage.backToOrders')"
        icon="pi pi-arrow-left"
        severity="secondary"
        variant="outlined"
        @click="emit('back')"
      />
    </div>

    <OrderSummaryCard :order="order" compact />

    <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
      <Card
        :pt="{
          body: { style: { padding: '0' } },
          content: { style: { padding: '0' } },
        }"
      >
        <template #content>
          <section class="grid gap-4 p-5 sm:p-6">
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-color">{{ t('orderDetailPage.itemsTitle') }}</h2>
              <p class="text-sm leading-6 text-muted-color">
                {{ t('orderDetailPage.itemsDescription') }}
              </p>
            </div>

            <div class="grid gap-3">
              <OrderLineItemRow v-for="line in lines" :key="line.lineId" :line="line" />
            </div>
          </section>
        </template>
      </Card>
    </div>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
      <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
        <Card
          :pt="{
            body: { style: { padding: '0' } },
            content: { style: { padding: '0' } },
          }"
        >
          <template #content>
            <section class="grid gap-4 p-5 sm:p-6">
              <div class="space-y-2">
                <h2 class="text-xl font-bold text-color">
                  {{ t('orderDetailPage.shippingTitle') }}
                </h2>
                <p class="text-sm leading-6 text-muted-color">
                  {{ t('orderDetailPage.shippingDescription') }}
                </p>
              </div>

              <dl v-if="shippingAddressEntries.length" class="grid gap-3">
                <div
                  v-for="[key, value] in shippingAddressEntries"
                  :key="key"
                  class="grid gap-1 rounded-lg border border-surface bg-surface-50 p-3"
                >
                  <dt class="text-sm text-muted-color">{{ formatAddressKey(key) }}</dt>
                  <dd class="text-sm font-medium text-color">{{ value }}</dd>
                </div>
              </dl>

              <Message v-else severity="secondary" variant="simple">
                {{ t('orderDetailPage.shippingEmpty') }}
              </Message>
            </section>
          </template>
        </Card>
      </div>

      <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
        <Card
          :pt="{
            body: { style: { padding: '0' } },
            content: { style: { padding: '0' } },
          }"
        >
          <template #content>
            <section class="grid gap-4 p-5 sm:p-6">
              <div class="space-y-2">
                <h2 class="text-xl font-bold text-color">
                  {{ t('orderDetailPage.trackingTitle') }}
                </h2>
                <p class="text-sm leading-6 text-muted-color">
                  {{ t('orderDetailPage.trackingDescription') }}
                </p>
              </div>

              <OrderTrackingTimeline
                :steps="trackingSteps"
                :status="trackingStatus"
                :error="trackingError"
              />
            </section>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

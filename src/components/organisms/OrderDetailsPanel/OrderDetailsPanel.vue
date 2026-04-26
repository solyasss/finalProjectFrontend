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
  shippingAddress: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'back'): void
}>()

const { t } = useI18n()

const shippingAddressText = computed(() => props.shippingAddress?.trim() ?? '')
const isCancelled = computed(() => props.order.status === 'CANCELLED')
const latestTrackingStepKey = computed(() => {
  if (props.order.status === 'DELIVERED') {
    return 'delivered'
  }

  if (props.order.status === 'SHIPPED') {
    return 'shipped'
  }

  if (props.order.status === 'PAID') {
    return 'paid'
  }

  return null
})

const trackingSteps = computed<OrderTrackingStep[]>(() => {
  const isPaid = ['PAID', 'SHIPPED', 'DELIVERED'].includes(props.order.status)
  const isShipped = ['SHIPPED', 'DELIVERED'].includes(props.order.status)
  const isDelivered = props.order.status === 'DELIVERED'

  return [
    {
      key: 'paid',
      title: t('orderStatus.PAID'),
      completed: isPaid,
      timestamp: latestTrackingStepKey.value === 'paid' ? props.order.createdAt : null,
    },
    {
      key: 'shipped',
      title: t('orderStatus.SHIPPED'),
      completed: isShipped,
      timestamp: latestTrackingStepKey.value === 'shipped' ? props.order.createdAt : null,
    },
    {
      key: 'delivered',
      title: t('orderStatus.DELIVERED'),
      completed: isDelivered,
      timestamp: latestTrackingStepKey.value === 'delivered' ? props.order.createdAt : null,
    },
  ]
})
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
              <OrderLineItemRow v-for="line in lines" :key="line.id" :line="line" />
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

              <p
                v-if="shippingAddressText"
                class="rounded-lg border border-surface bg-surface-50 p-4 text-sm text-color"
              >
                {{ shippingAddressText }}
              </p>

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

              <Message v-if="isCancelled" severity="warn" variant="simple">
                {{ t('orderStatus.CANCELLED') }}
              </Message>

              <OrderTrackingTimeline v-else :steps="trackingSteps" :status="order.status" />
            </section>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

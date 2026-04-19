<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import { useI18n } from 'vue-i18n'
import type { OrderSummary } from '@/api'
import PriceTag from '@/components/atoms/PriceTag/PriceTag.vue'
import { useOrderStatusPresentation } from '@/composables/useOrderStatusPresentation'

interface Props {
  order: OrderSummary
  actionLabel?: string
  compact?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'select'): void
}>()

const { t, d } = useI18n()
const { getOrderStatusMeta } = useOrderStatusPresentation()

const statusMeta = computed(() => getOrderStatusMeta(props.order.status))
const hasAction = computed(() => Boolean(props.actionLabel))
const isCompact = computed(() => props.compact ?? false)

function handleSelect() {
  emit('select')
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-surface bg-surface-0">
    <Card
      :pt="{
        body: { style: { padding: '0' } },
        content: { style: { padding: '0' } },
        footer: { style: { padding: '0' } },
      }"
    >
      <template #content>
        <article class="grid gap-5 p-5 sm:p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="space-y-2">
              <p class="text-sm font-semibold text-muted-color">
                {{ t('ordersPage.orderNumberValue', { orderId: order.orderId }) }}
              </p>
              <h2
                class="text-lg font-bold text-color"
                :class="isCompact ? 'md:text-xl' : 'md:text-2xl'"
              >
                {{ t('ordersPage.orderPlacedOn', { date: d(new Date(order.createdAt), 'short') }) }}
              </h2>
            </div>

            <Tag :value="statusMeta.label" :severity="statusMeta.severity" />
          </div>

          <dl class="grid gap-4 sm:grid-cols-3">
            <div class="space-y-1">
              <dt class="text-sm text-muted-color">{{ t('ordersPage.orderDate') }}</dt>
              <dd class="text-sm font-medium text-color">
                {{ d(new Date(order.createdAt), 'short') }}
              </dd>
            </div>

            <div class="space-y-1">
              <dt class="text-sm text-muted-color">{{ t('ordersPage.itemCountLabel') }}</dt>
              <dd class="text-sm font-medium text-color">
                {{ t('ordersPage.itemCountValue', { count: order.itemCount }) }}
              </dd>
            </div>

            <div class="space-y-1">
              <dt class="text-sm text-muted-color">{{ t('ordersPage.orderTotal') }}</dt>
              <dd>
                <PriceTag :current-price="order.total.formatted" size="compact" />
              </dd>
            </div>
          </dl>
        </article>
      </template>

      <template #footer>
        <div v-if="hasAction" class="border-t border-surface px-5 py-4 sm:px-6">
          <div class="flex justify-start sm:justify-end">
            <Button
              :label="actionLabel"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="handleSelect"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

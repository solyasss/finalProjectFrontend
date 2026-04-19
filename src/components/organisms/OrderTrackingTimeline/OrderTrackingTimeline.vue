<script setup lang="ts">
import { computed } from 'vue'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import { useI18n } from 'vue-i18n'
import type { OrderStatus, OrderTrackingStep } from '@/api'
import { useOrderStatusPresentation } from '@/composables/useOrderStatusPresentation'

interface Props {
  steps: OrderTrackingStep[]
  loading?: boolean
  error?: string | null
  status?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  status: null,
})

const { t, d } = useI18n()
const { getOrderStatusMeta } = useOrderStatusPresentation()

const STATUS_STEP_ALIASES: Record<OrderStatus, string[]> = {
  PLACED: ['placed'],
  PROCESSING: ['processing'],
  SHIPPED: ['shipped', 'transit', 'in_transit'],
  READY_FOR_PICKUP: ['ready_for_pickup', 'readyforpickup', 'pickup_ready', 'shipped'],
  DELIVERED: ['delivered'],
  CANCELLED: ['cancelled'],
}

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function findFallbackCurrentStepIndex(steps: OrderTrackingStep[]) {
  return steps.findIndex((step) => !step.completed)
}

function findStatusStepIndex(steps: OrderTrackingStep[], status: string | null) {
  if (!status) {
    return -1
  }

  const aliases = STATUS_STEP_ALIASES[status as OrderStatus]

  if (!aliases) {
    return -1
  }

  const normalizedAliases = new Set(aliases.map(normalizeKey))

  return steps.findIndex((step) => normalizedAliases.has(normalizeKey(step.key)))
}

const statusMeta = computed(() => {
  if (!props.status) {
    return null
  }

  return getOrderStatusMeta(props.status)
})

const normalizedSteps = computed(() => {
  const statusStepIndex = findStatusStepIndex(props.steps, props.status)

  if (statusStepIndex >= 0 && props.status) {
    return props.steps.map((step, index) => {
      if (props.status === 'DELIVERED') {
        return {
          ...step,
          state: index <= statusStepIndex ? 'completed' : 'upcoming',
        }
      }

      return {
        ...step,
        state:
          index < statusStepIndex
            ? 'completed'
            : index === statusStepIndex
              ? 'current'
              : 'upcoming',
      }
    })
  }

  const fallbackCurrentStepIndex = findFallbackCurrentStepIndex(props.steps)

  return props.steps.map((step, index) => ({
    ...step,
    state:
      step.completed || (fallbackCurrentStepIndex === -1 && index === props.steps.length - 1)
        ? 'completed'
        : index === fallbackCurrentStepIndex
          ? 'current'
          : 'upcoming',
  }))
})

function formatTimestamp(value?: string | null) {
  if (!value) {
    return null
  }

  return d(new Date(value), 'short')
}
</script>

<template>
  <Message v-if="loading" severity="secondary" variant="simple">
    {{ t('orderDetailPage.trackingLoading') }}
  </Message>

  <Message v-else-if="error" severity="error">
    {{ error }}
  </Message>

  <Message v-else-if="!steps.length" severity="secondary" variant="simple">
    {{ t('orderDetailPage.trackingUnavailable') }}
  </Message>

  <div v-else class="grid gap-4">
    <div v-if="statusMeta" class="flex flex-wrap items-center gap-3">
      <span class="text-sm font-medium text-muted-color">{{
        t('orderDetailPage.currentStatus')
      }}</span>
      <Tag :value="statusMeta.label" :severity="statusMeta.severity" />
    </div>

    <Timeline :value="normalizedSteps" align="left">
      <template #content="slotProps">
        <div>
          <p>{{ slotProps.item.title }}</p>
          <p v-if="formatTimestamp(slotProps.item.timestamp)">
            {{
              t('orderDetailPage.trackingUpdatedAt', {
                date: formatTimestamp(slotProps.item.timestamp),
              })
            }}
          </p>
        </div>
      </template>
    </Timeline>
  </div>
</template>

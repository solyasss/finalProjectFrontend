import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  getOrder,
  getOrderTracking,
  type CartLine,
  type OrderSummary,
  type OrderTrackingStep,
} from '@/api'

type ShippingAddress = Record<string, string> | null

export function useOrderDetailPage() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false)
  const pageError = ref<string | null>(null)
  const trackingError = ref<string | null>(null)
  const order = ref<OrderSummary | null>(null)
  const lines = ref<CartLine[]>([])
  const shippingAddress = ref<ShippingAddress>(null)
  const trackingStatus = ref<string | null>(null)
  const trackingSteps = ref<OrderTrackingStep[]>([])

  let activeRequestId = 0

  const orderId = computed(() => {
    const routeOrderId = route.params.orderId
    return typeof routeOrderId === 'string' ? routeOrderId.trim() : ''
  })

  function resetState() {
    order.value = null
    lines.value = []
    shippingAddress.value = null
    trackingStatus.value = null
    trackingSteps.value = []
  }

  async function reload() {
    const normalizedOrderId = orderId.value
    const requestId = ++activeRequestId

    pageError.value = null
    trackingError.value = null

    if (!normalizedOrderId) {
      resetState()
      pageError.value = t('orderDetailPage.invalidOrder')
      return
    }

    loading.value = true

    const [orderResult, trackingResult] = await Promise.all([
      getOrder(normalizedOrderId),
      getOrderTracking(normalizedOrderId),
    ])

    if (requestId !== activeRequestId) {
      return
    }

    loading.value = false

    if (!orderResult.ok) {
      resetState()
      pageError.value = orderResult.error.message || t('orderDetailPage.error')
      return
    }

    order.value = orderResult.data.order
    lines.value = orderResult.data.lines
    shippingAddress.value = orderResult.data.shippingAddress ?? null

    if (!trackingResult.ok) {
      trackingStatus.value = orderResult.data.order.status
      trackingSteps.value = []
      trackingError.value = trackingResult.error.message || t('orderDetailPage.trackingError')
      return
    }

    trackingStatus.value = trackingResult.data.status
    trackingSteps.value = trackingResult.data.steps
  }

  async function goBackToOrders() {
    await router.push({ name: 'orders' })
  }

  watch(
    orderId,
    () => {
      reload()
    },
    { immediate: true },
  )

  return {
    loading,
    pageError,
    trackingError,
    order,
    lines,
    shippingAddress,
    trackingStatus,
    trackingSteps,
    reload,
    goBackToOrders,
  }
}

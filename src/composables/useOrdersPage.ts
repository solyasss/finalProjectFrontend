import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw, LocationQueryValue } from 'vue-router'
import { getOrders, type OrderSummary, type Pagination } from '@/api'

export const ORDERS_PAGE_SIZE = 10

function parsePageQuery(value: LocationQueryValue | LocationQueryValue[] | undefined): number {
  if (typeof value !== 'string') {
    return 1
  }

  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

export function useOrdersPage() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const orders = ref<OrderSummary[]>([])
  const pagination = ref<Pagination | null>(null)

  const currentPage = computed(() => parsePageQuery(route.query.page))

  async function loadOrders() {
    loading.value = true
    error.value = null

    const result = await getOrders({
      page: currentPage.value,
      limit: ORDERS_PAGE_SIZE,
    })

    loading.value = false

    if (!result.ok) {
      orders.value = []
      pagination.value = null
      error.value = result.error.message || t('ordersPage.error')
      return
    }

    orders.value = result.data.orders
    pagination.value = result.data.pagination
  }

  async function setPage(page: number) {
    const nextPage = Math.max(1, Math.trunc(page))

    if (nextPage === currentPage.value) {
      return
    }

    const nextQuery: LocationQueryRaw = { ...route.query }

    if (nextPage === 1) {
      delete nextQuery.page
    } else {
      nextQuery.page = String(nextPage)
    }

    await router.replace({ query: nextQuery })
  }

  async function openOrder(orderId: string) {
    const normalizedOrderId = orderId.trim()

    if (!normalizedOrderId) {
      return
    }

    await router.push({
      name: 'order-detail',
      params: { orderId: normalizedOrderId },
    })
  }

  async function reload() {
    await loadOrders()
  }

  watch(
    () => route.query.page,
    () => {
      reload()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    orders,
    pagination,
    currentPage,
    reload,
    setPage,
    openOrder,
  }
}

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
  const allOrders = ref<OrderSummary[]>([])

  const currentPage = computed(() => parsePageQuery(route.query.page))

  const pagination = computed<Pagination | null>(() => {
    if (!allOrders.value.length) {
      return null
    }

    return {
      total: allOrders.value.length,
      page: currentPage.value,
      limit: ORDERS_PAGE_SIZE,
    }
  })

  const orders = computed(() => {
    const start = (currentPage.value - 1) * ORDERS_PAGE_SIZE
    return allOrders.value.slice(start, start + ORDERS_PAGE_SIZE)
  })

  async function loadOrders() {
    loading.value = true
    error.value = null

    try {
      const result = await getOrders()

      if (!result.ok) {
        allOrders.value = []
        error.value = result.error.message || t('ordersPage.error')
        return
      }

      allOrders.value = result.data.orders

      const maxPage = Math.max(1, Math.ceil(allOrders.value.length / ORDERS_PAGE_SIZE))

      if (currentPage.value > maxPage) {
        await setPage(maxPage)
      }
    } catch {
      allOrders.value = []
      error.value = t('ordersPage.error')
    } finally {
      loading.value = false
    }
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

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAdminOrders,
  normalizeAdminPagination,
  type AdminOrder,
  type AdminOrderStatus,
  type Pagination,
} from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminOrdersListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const orders = ref<AdminOrder[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  const userIdFilter = computed(() => {
    const value = Number(route.query.userId)
    return Number.isFinite(value) && value > 0 ? value : undefined
  })

  const statusFilter = computed(() => {
    const value = route.query.status
    return typeof value === 'string' ? (value as AdminOrderStatus) : undefined
  })

  async function loadOrders() {
    loading.value = true
    error.value = null

    const result = await getAdminOrders({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      userId: userIdFilter.value,
      status: statusFilter.value,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      orders.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    orders.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function updateQuery(
    nextPage: number,
    nextUserId: number | undefined,
    nextStatus: string | undefined,
  ) {
    const nextQuery: Record<string, string> = {}

    if (nextPage > 1) nextQuery.page = String(nextPage)
    if (nextUserId) nextQuery.userId = String(nextUserId)
    if (nextStatus) nextQuery.status = nextStatus

    await router.replace({ query: nextQuery })
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) return
    await updateQuery(nextPage, userIdFilter.value, statusFilter.value)
  }

  async function setUserId(nextUserId: number | undefined) {
    await updateQuery(1, nextUserId, statusFilter.value)
  }

  async function setStatus(nextStatus: AdminOrderStatus | undefined) {
    await updateQuery(1, userIdFilter.value, nextStatus)
  }

  watch(
    [currentPage, userIdFilter, statusFilter],
    () => {
      loadOrders()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    orders,
    pagination,
    currentPage,
    userIdFilter,
    statusFilter,
    setPage,
    setUserId,
    setStatus,
    reload: loadOrders,
  }
}

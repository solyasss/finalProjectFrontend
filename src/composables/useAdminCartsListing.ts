import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminCarts, normalizeAdminPagination, type AdminCart, type Pagination } from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminCartsListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const carts = ref<AdminCart[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  const userIdFilter = computed(() => {
    const value = Number(route.query.userId)
    return Number.isFinite(value) && value > 0 ? value : undefined
  })

  async function loadCarts() {
    loading.value = true
    error.value = null

    const result = await getAdminCarts({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      userId: userIdFilter.value,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      carts.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    carts.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function updateQuery(nextPage: number, nextUserId: number | undefined) {
    const nextQuery: Record<string, string> = {}

    if (nextPage > 1) nextQuery.page = String(nextPage)
    if (nextUserId) nextQuery.userId = String(nextUserId)

    await router.replace({ query: nextQuery })
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) return
    await updateQuery(nextPage, userIdFilter.value)
  }

  async function setUserId(nextUserId: number | undefined) {
    await updateQuery(1, nextUserId)
  }

  watch(
    [currentPage, userIdFilter],
    () => {
      loadCarts()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    carts,
    pagination,
    currentPage,
    userIdFilter,
    setPage,
    setUserId,
    reload: loadCarts,
  }
}

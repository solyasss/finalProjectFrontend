import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminReviews, normalizeAdminPagination, type AdminReview, type Pagination } from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminReviewsListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const reviews = ref<AdminReview[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  const filter = computed(() => (typeof route.query.filter === 'string' ? route.query.filter : ''))

  const productIdFilter = computed(() => {
    const value = Number(route.query.productId)
    return Number.isFinite(value) && value > 0 ? value : undefined
  })

  async function loadReviews() {
    loading.value = true
    error.value = null

    const result = await getAdminReviews({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      filter: filter.value || undefined,
      productId: productIdFilter.value,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      reviews.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    reviews.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function updateQuery(
    nextPage: number,
    nextFilter: string,
    nextProductId: number | undefined,
  ) {
    const nextQuery: Record<string, string> = {}

    if (nextPage > 1) nextQuery.page = String(nextPage)
    if (nextFilter.trim()) nextQuery.filter = nextFilter.trim()
    if (nextProductId) nextQuery.productId = String(nextProductId)

    await router.replace({ query: nextQuery })
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) return
    await updateQuery(nextPage, filter.value, productIdFilter.value)
  }

  async function setFilter(nextFilter: string) {
    await updateQuery(1, nextFilter, productIdFilter.value)
  }

  async function setProductId(nextProductId: number | undefined) {
    await updateQuery(1, filter.value, nextProductId)
  }

  watch(
    [currentPage, filter, productIdFilter],
    () => {
      loadReviews()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    reviews,
    pagination,
    currentPage,
    filter,
    productIdFilter,
    setPage,
    setFilter,
    setProductId,
    reload: loadReviews,
  }
}

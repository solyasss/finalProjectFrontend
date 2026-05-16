import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAdminPromotions,
  normalizeAdminPagination,
  type AdminPromotion,
  type Pagination,
} from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminPromotionsListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const promotions = ref<AdminPromotion[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  const filter = computed(() => (typeof route.query.filter === 'string' ? route.query.filter : ''))

  async function loadPromotions() {
    loading.value = true
    error.value = null

    const result = await getAdminPromotions({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      filter: filter.value || undefined,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      promotions.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    promotions.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function updateQuery(nextPage: number, nextFilter: string) {
    const nextQuery = { ...route.query }

    if (nextPage > 1) {
      nextQuery.page = String(nextPage)
    } else {
      delete nextQuery.page
    }

    if (nextFilter.trim()) {
      nextQuery.filter = nextFilter.trim()
    } else {
      delete nextQuery.filter
    }

    await router.replace({ query: nextQuery })
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) return
    await updateQuery(nextPage, filter.value)
  }

  async function setFilter(nextFilter: string) {
    await updateQuery(1, nextFilter)
  }

  watch(
    [currentPage, filter],
    () => {
      loadPromotions()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    promotions,
    pagination,
    currentPage,
    filter,
    setPage,
    setFilter,
    reload: loadPromotions,
  }
}

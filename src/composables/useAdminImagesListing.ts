import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminImages, normalizeAdminPagination, type AdminImage, type Pagination } from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminImagesListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const images = ref<AdminImage[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  const variantId = computed(() =>
    typeof route.query.variantId === 'string' ? route.query.variantId : '',
  )

  async function loadImages() {
    loading.value = true
    error.value = null

    const result = await getAdminImages({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
      variantId: variantId.value || undefined,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      images.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    images.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function updateQuery(nextPage: number, nextVariantId: string) {
    const nextQuery = { ...route.query }

    if (nextPage > 1) {
      nextQuery.page = String(nextPage)
    } else {
      delete nextQuery.page
    }

    if (nextVariantId.trim()) {
      nextQuery.variantId = nextVariantId.trim()
    } else {
      delete nextQuery.variantId
    }

    await router.replace({ query: nextQuery })
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) {
      return
    }

    await updateQuery(nextPage, variantId.value)
  }

  async function setVariantId(nextVariantId: string) {
    await updateQuery(1, nextVariantId)
  }

  watch(
    [currentPage, variantId],
    () => {
      loadImages()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    images,
    pagination,
    currentPage,
    variantId,
    setPage,
    setVariantId,
    reload: loadImages,
  }
}

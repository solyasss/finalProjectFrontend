import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminUsers, normalizeAdminPagination, type AdminUser, type Pagination } from '@/api'
import { i18n } from '@/i18n'

const DEFAULT_LIMIT = 10

export function useAdminUsersListing() {
  const route = useRoute()
  const router = useRouter()
  const t = i18n.global.t

  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = ref<AdminUser[]>([])
  const pagination = ref<Pagination>({ total: 0, page: 1, limit: DEFAULT_LIMIT })

  const currentPage = computed(() => {
    const value = Number(route.query.page)
    return Number.isFinite(value) && value > 0 ? value : 1
  })

  async function loadUsers() {
    loading.value = true
    error.value = null

    const result = await getAdminUsers({
      page: currentPage.value,
      limit: DEFAULT_LIMIT,
    })

    loading.value = false

    if (!result.ok) {
      error.value =
        result.error.code === 'FORBIDDEN'
          ? t('admin.messages.forbidden')
          : result.error.message || t('admin.messages.loadFailed')
      users.value = []
      pagination.value = { total: 0, page: currentPage.value, limit: DEFAULT_LIMIT }
      return
    }

    users.value = result.data.data
    pagination.value = normalizeAdminPagination(result.data.meta)
  }

  async function setPage(nextPage: number) {
    if (nextPage < 1 || nextPage === currentPage.value) return

    const nextQuery = { ...route.query }

    if (nextPage > 1) {
      nextQuery.page = String(nextPage)
    } else {
      delete nextQuery.page
    }

    await router.replace({ query: nextQuery })
  }

  watch(
    [currentPage],
    () => {
      loadUsers()
    },
    { immediate: true },
  )

  return { loading, error, users, pagination, currentPage, setPage, reload: loadUsers }
}

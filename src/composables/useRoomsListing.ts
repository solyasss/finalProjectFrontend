import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRooms, type Pagination, type Room, type RoomListResponse } from '@/api'

const loading = ref(false)
const error = ref<string | null>(null)
const rooms = ref<Room[]>([])
const pagination = ref<Pagination | null>(null)

let activeRequestId = 0
let hasLoaded = false
let pendingReload: Promise<void> | null = null

function normalizePagination(meta: RoomListResponse['meta'] | undefined): Pagination {
  const total = Number(meta?.totalItems)
  const page = Number(meta?.currentPage)
  const limit = Number(meta?.itemsPerPage)

  return {
    total: Number.isFinite(total) && total >= 0 ? total : 0,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 0,
  }
}

function normalizeRooms(data: RoomListResponse | undefined): Room[] {
  return Array.isArray(data?.data) ? data.data : []
}

export function useRoomsListing() {
  const { t } = useI18n()

  function reload(options?: { force?: boolean }): Promise<void> {
    if (pendingReload) {
      return pendingReload
    }

    if (hasLoaded && !options?.force) {
      return Promise.resolve()
    }

    pendingReload = (async () => {
      const requestId = ++activeRequestId

      loading.value = true
      error.value = null

      const result = await getRooms()

      if (requestId !== activeRequestId) {
        return
      }

      if (!result.ok) {
        loading.value = false
        rooms.value = []
        pagination.value = null
        error.value = result.error.message || t('roomsPage.error')
        return
      }

      loading.value = false
      rooms.value = normalizeRooms(result.data)
      pagination.value = normalizePagination(result.data.meta)
      hasLoaded = true
    })().finally(() => {
      pendingReload = null
    })

    return pendingReload
  }

  if (!hasLoaded && !pendingReload) {
    void reload()
  }

  return {
    loading,
    error,
    rooms,
    pagination,
    reload,
  }
}

import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getRoom, type ProductSetSummary, type RoomDetails } from '@/api'

function normalizeNumericRouteParam(value: unknown): number | null {
  const id = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN
  return Number.isFinite(id) && id > 0 ? id : null
}

export function useRoomDetailPage() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const room = ref<RoomDetails | null>(null)

  let activeRequestId = 0

  const roomId = computed(() => normalizeNumericRouteParam(route.params.roomId))
  const sets = computed<ProductSetSummary[]>(() => room.value?.sets ?? [])

  function resetState() {
    room.value = null
  }

  async function reload() {
    const normalizedRoomId = roomId.value
    const requestId = ++activeRequestId

    error.value = null

    if (!normalizedRoomId) {
      resetState()
      loading.value = false
      error.value = t('roomDetailPage.invalidRoom')
      return
    }

    loading.value = true

    const result = await getRoom(normalizedRoomId)

    if (requestId !== activeRequestId) {
      return
    }

    loading.value = false

    if (!result.ok) {
      resetState()
      error.value = result.error.message || t('roomDetailPage.error')
      return
    }

    room.value = result.data
  }

  async function openProductSet(productSetId: number) {
    if (!roomId.value) {
      return
    }

    await router.push({
      name: 'product-set-detail',
      params: {
        roomId: roomId.value,
        setId: productSetId,
      },
    })
  }

  async function goBackToRooms() {
    await router.push({ name: 'rooms' })
  }

  watch(
    roomId,
    () => {
      void reload()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    roomId,
    room,
    sets,
    reload,
    openProductSet,
    goBackToRooms,
  }
}

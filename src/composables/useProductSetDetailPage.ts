import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  getProductSet,
  type ProductSetDetails,
  type ProductSetVariant,
  type RoomSummary,
} from '@/api'
import { extractImageUrl, normalizeImageUrls } from '@/utils/image'

function normalizeNumericRouteParam(value: unknown): number | null {
  const id = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN
  return Number.isFinite(id) && id > 0 ? id : null
}

function normalizeRoomSummary(room: RoomSummary): RoomSummary {
  return {
    ...room,
    imageUrl: extractImageUrl(room.imageUrl),
  }
}

function normalizeProductSetVariant(variant: ProductSetVariant): ProductSetVariant {
  return {
    ...variant,
    images: normalizeImageUrls(variant.images),
  }
}

function normalizeProductSetDetails(productSet: ProductSetDetails): ProductSetDetails {
  return {
    ...productSet,
    imageUrl: extractImageUrl(productSet.imageUrl),
    room: normalizeRoomSummary(productSet.room),
    variants: productSet.variants.map(normalizeProductSetVariant),
  }
}

export function useProductSetDetailPage() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const productSet = ref<ProductSetDetails | null>(null)

  let activeRequestId = 0

  const roomId = computed(() => normalizeNumericRouteParam(route.params.roomId))
  const setId = computed(() => normalizeNumericRouteParam(route.params.setId))
  const variants = computed<ProductSetVariant[]>(() => productSet.value?.variants ?? [])
  const parentRoom = computed<RoomSummary | null>(() => productSet.value?.room ?? null)

  function resetState() {
    productSet.value = null
  }

  async function reload() {
    const normalizedRoomId = roomId.value
    const normalizedSetId = setId.value
    const requestId = ++activeRequestId

    error.value = null

    if (!normalizedRoomId) {
      resetState()
      loading.value = false
      error.value = t('productSetDetailPage.invalidRoom')
      return
    }

    if (!normalizedSetId) {
      resetState()
      loading.value = false
      error.value = t('productSetDetailPage.invalidSet')
      return
    }

    loading.value = true

    const result = await getProductSet(normalizedSetId)

    if (requestId !== activeRequestId) {
      return
    }

    loading.value = false

    if (!result.ok) {
      resetState()
      error.value = result.error.message || t('productSetDetailPage.error')
      return
    }

    if (result.data.room.id !== normalizedRoomId) {
      resetState()
      error.value = t('productSetDetailPage.roomMismatch')
      return
    }

    productSet.value = normalizeProductSetDetails(result.data)
  }

  async function goBackToRoom() {
    if (!roomId.value) {
      await router.push({ name: 'rooms' })
      return
    }

    await router.push({
      name: 'room-detail',
      params: { roomId: roomId.value },
    })
  }

  watch(
    [roomId, setId],
    () => {
      void reload()
    },
    { immediate: true },
  )

  return {
    loading,
    error,
    roomId,
    setId,
    productSet,
    variants,
    parentRoom,
    reload,
    goBackToRoom,
  }
}

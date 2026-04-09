import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getWishlist, addWishlistItem, removeWishlistItem } from '@/api'
import type { WishlistItem, AddWishlistItemRequest, Pagination } from '@/api'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => items.value.length)
  const hasMore = computed(
    () =>
      pagination.value !== null &&
      pagination.value.page * pagination.value.limit < pagination.value.total,
  )

  function isInWishlist(productId: string): boolean {
    return items.value.some((i: WishlistItem) => i.productId === productId)
  }

  async function fetchWishlist(page = 1, limit = 24) {
    loading.value = true
    error.value = null
    const res = await getWishlist({ page, limit })
    if (res.ok) {
      // Append for "load more", replace for first page
      items.value = page > 1 ? [...items.value, ...res.data.items] : res.data.items
      pagination.value = res.data.pagination
    } else {
      error.value = res.error.message
    }
    loading.value = false
  }

  async function addItem(payload: AddWishlistItemRequest) {
    const res = await addWishlistItem(payload)
    if (res.ok) {
      items.value = res.data.items
      pagination.value = res.data.pagination
    }
  }

  async function removeItem(wishlistItemId: string) {
    const res = await removeWishlistItem(wishlistItemId)
    if (res.ok) {
      items.value = res.data.items
      pagination.value = res.data.pagination
    }
  }

  async function toggleItem(payload: AddWishlistItemRequest) {
    const existing = items.value.find((i: WishlistItem) => i.productId === payload.productId)
    if (existing) {
      await removeItem(existing.wishlistItemId)
    } else {
      await addItem(payload)
    }
  }

  return {
    items,
    pagination,
    loading,
    error,
    itemCount,
    hasMore,
    isInWishlist,
    fetchWishlist,
    addItem,
    removeItem,
    toggleItem,
  }
})
